import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { OperationPlanService } from '../../services-oem/operationPlan.service';

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
}
