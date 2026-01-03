import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { OperationPlanService } from '../../services-oem/operationPlan.service';

interface ChangeLogEntryModel {
  date: Date;
  author: string;
  reason: string;
  changes: string;
}

interface OperationPlanModel {
  id: string;
  vvn: string;
  targetDay: Date;
  arrivalTime: Date;
  departureTime: Date;
  operations: OperationEntryModel[];
  author: string;
  algorithm: string;
  createdAt: Date;
  changeLog?: ChangeLogEntryModel[];
}

interface OperationEntryModel {
  id: string;
  operationType: string;
  container: string;
  operationStart: Date;
  operationEnd: Date;
  craneUsed: string;
}

@Component({
  selector: 'app-operation-plan',
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './operationPlan.html',
  styleUrl: './operationPlan.css',
})
export class OperationPlan implements OnInit, OnDestroy {
  isLoading: boolean = false;
  operationPlans: OperationPlanModel[] = [];
  filteredPlans: OperationPlanModel[] = [];

  // Search
  searchTerm: string = '';
  private destroy$ = new Subject<void>();

  // Selected plan for details modal
  selectedPlan: OperationPlanModel | null = null;
  showDetailsModal: boolean = false;

  // Edit modal
  showEditModal: boolean = false;
  isEditing: boolean = false;
  editPlan: any = null;
  originalEditPlan: any = null;
  editErrorMessage: string = '';
  editSuccessMessage: string = '';
  timeExceedsWarning: boolean = false;

  constructor(
    private operationPlanService: OperationPlanService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadOperationPlans();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadOperationPlans() {
    this.isLoading = true;
    this.operationPlanService.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (plans) => {
          this.operationPlans = plans || [];
          this.filteredPlans = [...this.operationPlans];
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading operation plans:', error);
          this.isLoading = false;
        }
      });
  }

  onSearchChange() {
    const term = this.searchTerm.toLowerCase().trim();

    if (!term) {
      this.filteredPlans = [...this.operationPlans];
      return;
    }

    this.filteredPlans = this.operationPlans.filter(plan =>
      plan.vvn.toLowerCase().includes(term) ||
      plan.author.toLowerCase().includes(term) ||
      plan.algorithm.toLowerCase().includes(term) ||
      plan.id.toLowerCase().includes(term)
    );
  }

  viewDetails(plan: OperationPlanModel) {
    this.selectedPlan = plan;
    this.showDetailsModal = true;
  }

  selectPlan(plan: OperationPlanModel) {
    if (this.selectedPlan?.id === plan.id) {
      this.selectedPlan = null;
    } else {
      this.selectedPlan = plan;
    }
  }

  closeDetailsModal() {
    this.showDetailsModal = false;
    this.selectedPlan = null;
  }

  formatDate(date: Date | string): string {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatDateOnly(date: Date | string): string {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }

  // Edit operations
  onUpdate() {
    if (!this.selectedPlan) return;

    // Deep clone to avoid modifying the original
    this.editPlan = {
      ...this.selectedPlan,
      targetDay: this.formatDateForInput(this.selectedPlan.targetDay),
      arrivalTime: this.formatDateTimeForInput(this.selectedPlan.arrivalTime),
      departureTime: this.formatDateTimeForInput(this.selectedPlan.departureTime),
      changeReason: '',  // Initialize empty change reason
      operations: this.selectedPlan.operations.map(op => ({
        ...op,
        operationStart: this.formatDateTimeForInput(op.operationStart),
        operationEnd: this.formatDateTimeForInput(op.operationEnd)
      }))
    };
    this.originalEditPlan = JSON.parse(JSON.stringify(this.editPlan));
    this.showEditModal = true;
    this.editErrorMessage = '';
    this.editSuccessMessage = '';
  }

  closeEditModal() {
    this.showEditModal = false;
    this.editPlan = null;
    this.originalEditPlan = null;
    this.isEditing = false;
    this.editErrorMessage = '';
    this.editSuccessMessage = '';
    this.timeExceedsWarning = false;
  }



  checkTimeExceedsDeparture() {
    if (!this.editPlan || !this.editPlan.operations || this.editPlan.operations.length === 0) {
      this.timeExceedsWarning = false;
      return;
    }

    const lastOperation = this.editPlan.operations[this.editPlan.operations.length - 1];
    const departureDate = new Date(this.editPlan.departureTime);
    const operationEndDate = new Date(lastOperation.operationEnd);

    // Compare if operation end is after departure time
    this.timeExceedsWarning = operationEndDate > departureDate;
  }

  validateOperationTimes(): string | null {
    if (!this.editPlan || !this.editPlan.operations) {
      return null;
    }

    for (let i = 0; i < this.editPlan.operations.length; i++) {
      const op = this.editPlan.operations[i];
      const startTime = new Date(op.operationStart);
      const endTime = new Date(op.operationEnd);

      if (startTime >= endTime) {
        return `Operation ${i + 1}: Start time must be before end time.`;
      }
    }

    return null;
  }



  onSaveEdit() {
    this.editErrorMessage = '';
    this.editSuccessMessage = '';

    if (!this.selectedPlan) {
      this.editErrorMessage = 'No operation plan selected.';
      return;
    }

    // Validate operation times
    const validationError = this.validateOperationTimes();
    if (validationError) {
      this.editErrorMessage = validationError;
      return;
    }

    // Prepare the payload with proper date formatting
    const payload: any = {
      id: this.editPlan.id,
      vvn: this.editPlan.vvn,
      targetDay: new Date(this.editPlan.targetDay),
      arrivalTime: new Date(this.editPlan.arrivalTime),
      departureTime: new Date(this.editPlan.departureTime),
      author: this.editPlan.author,
      algorithm: this.editPlan.algorithm,
      createdAt: this.selectedPlan.createdAt,
      changeReason: this.editPlan.changeReason,  // Include change reason
      operations: this.editPlan.operations.map((op: any) => ({
        id: op.id,
        operationType: op.operationType,
        container: op.container,
        operationStart: new Date(op.operationStart),
        operationEnd: new Date(op.operationEnd),
        craneUsed: op.craneUsed
      }))
    };

    this.isEditing = true;
    this.operationPlanService.update(this.editPlan.vvn, payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updated) => {
          this.isEditing = false;
          this.editSuccessMessage = 'Operation plan updated successfully!';

          // Update the local arrays
          const idx = this.operationPlans.findIndex(p => p.id === this.selectedPlan!.id);
          if (idx !== -1) {
            this.operationPlans[idx] = updated;
          }
          const filteredIdx = this.filteredPlans.findIndex(p => p.id === this.selectedPlan!.id);
          if (filteredIdx !== -1) {
            this.filteredPlans[filteredIdx] = updated;
          }
          this.selectedPlan = updated;

          setTimeout(() => {
            this.closeEditModal();
          }, 1500);
        },
        error: (error) => {
          this.isEditing = false;
          this.editErrorMessage = error?.error?.error || error?.error?.message || 'Error updating operation plan.';
          console.error('Error updating operation plan:', error);
        }
      });
  }

  // Helper methods for date/time formatting
  formatDateForInput(date: Date | string): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  formatDateTimeForInput(date: Date | string): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  formatTimeForInput(date: Date | string): string {
    const d = new Date(date);
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }
}
