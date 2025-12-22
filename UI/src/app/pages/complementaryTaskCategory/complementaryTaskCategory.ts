import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { ComplementaryTaskCategoryService } from '../../services-oem/complementaryTaskCategory.service';
import { ComplementaryTaskCategoryModel } from '../../models/complementaryTaskCategory.model';

@Component({
  selector: 'app-complementary-task-category',
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './complementaryTaskCategory.html',
  styleUrl: './complementaryTaskCategory.css',
})
export class ComplementaryTaskCategory implements OnInit, OnDestroy {
  complementaryTaskCategories: ComplementaryTaskCategoryModel[] = [];
  filteredComplementaryTaskCategories: ComplementaryTaskCategoryModel[] = [];
  selectedComplementaryTaskCategory: ComplementaryTaskCategoryModel | null = null;
  searchTerm: string = '';
  filterHasParent: string = '';
  isLoading: boolean = false;

  // Page status messages
  statusMessage: string = '';
  statusMessageType: 'success' | 'error' | '' = '';
  statusHiding: boolean = false;
  // Search-specific error
  searchError: string = '';
  searchErrorHiding: boolean = false;

  // Create modal
  showCreateModal: boolean = false;
  isCreating: boolean = false;
  newComplementaryTaskCategory: any = { code: '', name: '', description: '', duration: null, parentComplementaryTaskCategoryCode: null };
  modalErrorMessage: string = '';
  modalSuccessMessage: string = '';
  fieldErrors: { [key: string]: string } = {};

  // Edit modal
  showEditModal: boolean = false;
  isEditing: boolean = false;
  editComplementaryTaskCategory: any = { code: '', name: '', description: '', duration: null, parentComplementaryTaskCategoryCode: null };
  originalEditComplementaryTaskCategory: any | null = null;
  editModalErrorMessage: string = '';
  editFieldErrors: { [key: string]: string } = {};

  private destroy$ = new Subject<void>();
  private searchSubject$ = new Subject<string>();

  constructor(private complementaryTaskCategoryService: ComplementaryTaskCategoryService) {}

  ngOnInit() {
    this.loadComplementaryTaskCategories();
    this.setupSearch();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setupSearch() {
    this.searchSubject$
      .pipe(debounceTime(250), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(term => this.applyFilter(term));
  }

  onSearchInput() {
    if (!this.searchTerm || !this.searchTerm.trim()) {
      this.hideSearchErrorImmediate();
    }
    this.searchSubject$.next(this.searchTerm);
  }

  onFilterChange() {
    this.applyAllFilters();
  }

  applyFilter(term: string) {
    this.applyAllFilters();
  }

  applyAllFilters() {
    let results = [...this.complementaryTaskCategories];

    // Apply search term filter
    if (this.searchTerm && this.searchTerm.trim()) {
      const t = this.searchTerm.toLowerCase();
      results = results.filter(ctc =>
        (ctc.code || '').toLowerCase().includes(t) ||
        (ctc.name || '').toLowerCase().includes(t) ||
        (ctc.description || '').toLowerCase().includes(t)
      );
    }

    // Apply hasParent filter
    if (this.filterHasParent) {
      const hasParent = this.filterHasParent === 'true';
      results = results.filter(ctc => {
        const has = !!(ctc.parentComplementaryTaskCategoryCode && ctc.parentComplementaryTaskCategoryCode.trim());
        return has === hasParent;
      });
    }

    this.filteredComplementaryTaskCategories = results;

    if (results.length > 0) {
      this.hideSearchErrorImmediate();
    } else if (this.searchTerm || this.filterHasParent) {
      // Only try server-side search if we have a search term and no local results
      if (this.searchTerm && this.searchTerm.trim()) {
        this.searchServerSide(this.searchTerm);
      }
    }
  }

  searchServerSide(term: string) {
    // Try to find by code
    this.complementaryTaskCategoryService.getComplementaryTaskCategoryByCode(term).subscribe({
      next: (result: ComplementaryTaskCategoryModel) => {
        if (result) {
          this.filteredComplementaryTaskCategories = [result];
          this.hideSearchErrorImmediate();
        } else {
          // Try by name
          this.complementaryTaskCategoryService.getComplementaryTaskCategoryByName(term).subscribe({
            next: (byName: ComplementaryTaskCategoryModel) => {
              if (byName) {
                this.filteredComplementaryTaskCategories = [byName];
                this.hideSearchErrorImmediate();
              } else {
                this.showSearchError(`No complementary task categories found for "${term}".`);
              }
            },
            error: (err: any) => {
              this.showSearchError(`No complementary task categories found for "${term}".`);
            }
          });
        }
      },
      error: (err: any) => {
        // Try by name
        this.complementaryTaskCategoryService.getComplementaryTaskCategoryByName(term).subscribe({
          next: (byName: ComplementaryTaskCategoryModel) => {
            if (byName) {
              this.filteredComplementaryTaskCategories = [byName];
              this.hideSearchErrorImmediate();
            } else {
              this.showSearchError(`No complementary task categories found for "${term}".`);
            }
          },
          error: (err2: any) => {
            this.showSearchError(`No complementary task categories found for "${term}".`);
          }
        });
      }
    });
  }

  loadComplementaryTaskCategories() {
    this.isLoading = true;
    this.complementaryTaskCategoryService.getAllComplementaryTaskCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: ComplementaryTaskCategoryModel[]) => {
          this.complementaryTaskCategories = res || [];
          this.filteredComplementaryTaskCategories = [...this.complementaryTaskCategories];
          this.isLoading = false;
        },
        error: (err: any) => {
          this.showSearchError('Error loading complementary task categories. Please check your connection.');
          console.error('Error loading complementary task categories', err);
          this.isLoading = false;
        }
      });
  }

  showSearchError(message: string) {
    this.searchError = message;
    this.searchErrorHiding = false;
  }

  hideSearchErrorImmediate() {
    if (!this.searchError) return;
    this.searchErrorHiding = true;
    setTimeout(() => {
      this.searchError = '';
      this.searchErrorHiding = false;
    }, 220);
  }

  selectComplementaryTaskCategory(ctc: ComplementaryTaskCategoryModel) {
    if (this.selectedComplementaryTaskCategory?.code === ctc.code) {
      this.selectedComplementaryTaskCategory = null;
      return;
    }
    this.selectedComplementaryTaskCategory = ctc;
  }

  // Create
  onCreateNew() {
    this.showCreateModal = true;
    this.resetNewComplementaryTaskCategory();
  }

  resetNewComplementaryTaskCategory() {
    this.newComplementaryTaskCategory = { code: '', name: '', description: '', duration: null, parentComplementaryTaskCategoryCode: null };
    this.modalErrorMessage = '';
    this.fieldErrors = {};
  }

  closeCreateModal() {
    this.showCreateModal = false;
    this.resetNewComplementaryTaskCategory();
    this.isCreating = false;
  }

  onSaveNewComplementaryTaskCategory() {
    this.modalErrorMessage = '';
    this.modalSuccessMessage = '';
    this.fieldErrors = {};

    if (!this.newComplementaryTaskCategory.code?.trim() || !this.newComplementaryTaskCategory.name?.trim() || !this.newComplementaryTaskCategory.description?.trim()) {
      this.modalErrorMessage = 'Please fill required fields.';
      return;
    }

    // Check if parent is the same as the code being created
    if (this.newComplementaryTaskCategory.parentComplementaryTaskCategoryCode &&
        this.newComplementaryTaskCategory.parentComplementaryTaskCategoryCode.trim() === this.newComplementaryTaskCategory.code.trim()) {
      this.fieldErrors['parentComplementaryTaskCategoryCode'] = 'A complementary task category cannot be its own parent.';
      this.modalErrorMessage = 'A complementary task category cannot be its own parent.';
      return;
    }

    // Clean up empty parent
    if (!this.newComplementaryTaskCategory.parentComplementaryTaskCategoryCode || !this.newComplementaryTaskCategory.parentComplementaryTaskCategoryCode.trim()) {
      this.newComplementaryTaskCategory.parentComplementaryTaskCategoryCode = null;
    }

    // Clean up empty duration
    if (!this.newComplementaryTaskCategory.duration || !this.newComplementaryTaskCategory.duration.trim()) {
      this.newComplementaryTaskCategory.duration = null;
    }

    this.isCreating = true;
    this.complementaryTaskCategoryService.createComplementaryTaskCategory(this.newComplementaryTaskCategory).subscribe({
      next: (created: ComplementaryTaskCategoryModel) => {
        this.isCreating = false;
        this.showCreateModal = false;
        this.loadComplementaryTaskCategories();
        this.statusMessage = `Complementary task category "${created?.code || this.newComplementaryTaskCategory.code}" created successfully.`;
        this.statusMessageType = 'success';
        this.statusHiding = false;
        setTimeout(() => this.clearStatusMessage(), 3000);
      },
      error: (err: any) => {
        this.isCreating = false;
        this.handleCreateError(err);
      }
    });
  }

  // Edit
  onUpdate() {
    if (!this.selectedComplementaryTaskCategory) return;
    this.editComplementaryTaskCategory = { ...this.selectedComplementaryTaskCategory };
    this.originalEditComplementaryTaskCategory = { ...this.editComplementaryTaskCategory };
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.resetEditComplementaryTaskCategory();
    this.isEditing = false;
  }

  resetEditComplementaryTaskCategory() {
    this.editComplementaryTaskCategory = { code: '', name: '', description: '', duration: null, parentComplementaryTaskCategoryCode: null };
    this.editModalErrorMessage = '';
    this.editFieldErrors = {};
    this.originalEditComplementaryTaskCategory = null;
  }

  isEditDirty(): boolean {
    if (!this.originalEditComplementaryTaskCategory) return false;
    const orig = this.originalEditComplementaryTaskCategory;
    const curr = this.editComplementaryTaskCategory || {};

    const nameChanged = (orig.name || '').trim() !== (curr.name || '').trim();
    const descChanged = (orig.description || '').trim() !== (curr.description || '').trim();
    const durationChanged = (orig.duration || '') !== (curr.duration || '');
    const parentChanged = (orig.parentComplementaryTaskCategoryCode || '') !== (curr.parentComplementaryTaskCategoryCode || '');

    return nameChanged || descChanged || durationChanged || parentChanged;
  }

  onSaveEditComplementaryTaskCategory() {
    this.editModalErrorMessage = '';
    this.editFieldErrors = {};

    if (!this.editComplementaryTaskCategory.name?.trim() || !this.editComplementaryTaskCategory.description?.trim()) {
      this.editModalErrorMessage = 'Please fill required fields.';
      return;
    }

    if (!this.selectedComplementaryTaskCategory) {
      this.editModalErrorMessage = 'No complementary task category selected for editing.';
      return;
    }

    if (!this.isEditDirty()) {
      this.editModalErrorMessage = 'No changes to save.';
      return;
    }

    // Check if parent is the same as the code being edited
    if (this.editComplementaryTaskCategory.parentComplementaryTaskCategoryCode &&
        this.editComplementaryTaskCategory.parentComplementaryTaskCategoryCode.trim() === this.editComplementaryTaskCategory.code.trim()) {
      this.editFieldErrors['parentComplementaryTaskCategoryCode'] = 'A complementary task category cannot be its own parent.';
      this.editModalErrorMessage = 'A complementary task category cannot be its own parent.';
      return;
    }

    // Prepare payload - ensure all required fields are present
    const payload: any = {
      code: this.editComplementaryTaskCategory.code,
      name: this.editComplementaryTaskCategory.name.trim(),
      description: this.editComplementaryTaskCategory.description.trim()
    };

    // Only include parentComplementaryTaskCategoryCode if it has a value
    if (this.editComplementaryTaskCategory.parentComplementaryTaskCategoryCode && this.editComplementaryTaskCategory.parentComplementaryTaskCategoryCode.trim()) {
      payload.parentComplementaryTaskCategoryCode = this.editComplementaryTaskCategory.parentComplementaryTaskCategoryCode.trim();
    }

    // Only include duration if it has a value
    if (this.editComplementaryTaskCategory.duration && this.editComplementaryTaskCategory.duration.trim()) {
      payload.duration = this.editComplementaryTaskCategory.duration.trim();
    } else {
      payload.duration = null;
    }

    this.isEditing = true;
    this.complementaryTaskCategoryService.updateComplementaryTaskCategory(this.editComplementaryTaskCategory.code, payload).subscribe({
      next: (updated: ComplementaryTaskCategoryModel) => {
        this.isEditing = false;
        this.showEditModal = false;

        const code = this.editComplementaryTaskCategory.code;
        const returned = updated && typeof updated === 'object' ? updated : this.editComplementaryTaskCategory;
        const normalized: any = { ...this.editComplementaryTaskCategory, ...returned };

        // Update arrays
        const uIdx = this.complementaryTaskCategories.findIndex(x => x.code === code);
        if (uIdx !== -1) {
          this.complementaryTaskCategories[uIdx] = { ...this.complementaryTaskCategories[uIdx], ...normalized };
        }
        const fIdx = this.filteredComplementaryTaskCategories.findIndex(x => x.code === code);
        if (fIdx !== -1) {
          this.filteredComplementaryTaskCategories[fIdx] = { ...this.filteredComplementaryTaskCategories[fIdx], ...normalized };
        }
        if (this.selectedComplementaryTaskCategory && this.selectedComplementaryTaskCategory.code === code) {
          this.selectedComplementaryTaskCategory = { ...this.selectedComplementaryTaskCategory, ...normalized };
        }

        this.applyAllFilters();
        this.resetEditComplementaryTaskCategory();
        this.statusHiding = false;
        this.statusMessage = `Complementary task category "${code}" updated successfully.`;
        this.statusMessageType = 'success';
        setTimeout(() => this.clearStatusMessage(), 3000);
      },
      error: (err: any) => {
        this.isEditing = false;
        console.error('Error updating complementary task category', err);
        this.handleEditError(err);
      }
    });
  }

  extractErrorMessage(err: any): string {
    try {
      if (!err) return '';
      if (err.error && typeof err.error === 'string') return this.cleanErrorMessage(err.error);
      if (err.error && Array.isArray(err.error)) return err.error.map((e: any) => this.cleanErrorMessage(String(e))).join('; ');
      if (err.error && typeof err.error === 'object') {
        if (err.error.message) return this.cleanErrorMessage(err.error.message);
        if (err.error.errors) {
          try {
            const arr = [] as string[];
            for (const k in err.error.errors) {
              const v = err.error.errors[k];
              if (Array.isArray(v)) arr.push(...v.map((x: any) => this.cleanErrorMessage(String(x))));
              else arr.push(this.cleanErrorMessage(String(v)));
            }
            if (arr.length) return arr.join('; ');
          } catch (e) { /* ignore */ }
        }
      }
      if (err.message) return this.cleanErrorMessage(err.message);
      return JSON.stringify(err);
    } catch (e) { return 'Unknown error'; }
  }

  private cleanErrorMessage(message: string): string {
    // Remove common error prefixes
    const prefixes = [
      'Unexpected error creating ComplementaryTaskCategory: ',
      'Unexpected error updating ComplementaryTaskCategory: ',
      'Error creating ComplementaryTaskCategory: ',
      'Error updating ComplementaryTaskCategory: '
    ];
    let cleaned = message;
    for (const prefix of prefixes) {
      if (cleaned.startsWith(prefix)) {
        cleaned = cleaned.substring(prefix.length);
        break;
      }
    }
    return cleaned;
  }

  clearStatusMessage() {
    if (!this.statusMessage) return;
    this.statusHiding = true;
    setTimeout(() => {
      this.statusMessage = '';
      this.statusMessageType = '';
      this.statusHiding = false;
    }, 220);
  }

  private handleCreateError(error: any) {
    this.fieldErrors = {};
    this.modalErrorMessage = '';
    try {
      const backendError = error?.error ?? error?.originalError?.error ?? null;

      if (!backendError) {
        this.modalErrorMessage = this.extractErrorMessage(error) || 'Error creating complementary task category.';
        return;
      }

      if (Array.isArray(backendError)) {
        this.modalErrorMessage = backendError.map((e: any) => this.cleanErrorMessage(String(e))).join('; ');
        return;
      }

      if (backendError && typeof backendError === 'object' && backendError.errors && typeof backendError.errors === 'object') {
        for (const field in backendError.errors) {
          const v = backendError.errors[field];
          const errorMsg = Array.isArray(v) ? v.join('; ') : String(v);
          this.fieldErrors[field.toLowerCase()] = this.cleanErrorMessage(errorMsg);
        }
        const msg = backendError.message ?? backendError.title ?? 'Please correct the validation errors below.';
        this.modalErrorMessage = this.cleanErrorMessage(msg);
        return;
      }

      if (backendError && typeof backendError === 'object' && (backendError.message || backendError.title)) {
        this.modalErrorMessage = this.cleanErrorMessage(backendError.message ?? backendError.title);
        return;
      }

      if (typeof backendError === 'string') {
        this.modalErrorMessage = this.cleanErrorMessage(backendError);
        return;
      }

      this.modalErrorMessage = this.extractErrorMessage(error) || 'Error creating complementary task category.';
    } catch (e) {
      this.modalErrorMessage = this.extractErrorMessage(error) || 'Error creating complementary task category.';
    }
  }

  private handleEditError(error: any) {
    this.editFieldErrors = {};
    this.editModalErrorMessage = '';
    try {
      const backendError = error?.error ?? error?.originalError?.error ?? null;

      if (!backendError) {
        this.editModalErrorMessage = this.extractErrorMessage(error) || 'Error updating complementary task category.';
        return;
      }

      if (Array.isArray(backendError)) {
        this.editModalErrorMessage = backendError.map((e: any) => this.cleanErrorMessage(String(e))).join('; ');
        return;
      }

      if (backendError && typeof backendError === 'object' && backendError.errors && typeof backendError.errors === 'object') {
        for (const field in backendError.errors) {
          const v = backendError.errors[field];
          const errorMsg = Array.isArray(v) ? v.join('; ') : String(v);
          this.editFieldErrors[field.toLowerCase()] = this.cleanErrorMessage(errorMsg);
        }
        const msg = backendError.message ?? backendError.title ?? 'Please correct the validation errors below.';
        this.editModalErrorMessage = this.cleanErrorMessage(msg);
        return;
      }

      if (backendError && typeof backendError === 'object' && (backendError.message || backendError.title)) {
        this.editModalErrorMessage = this.cleanErrorMessage(backendError.message ?? backendError.title);
        return;
      }

      if (typeof backendError === 'string') {
        this.editModalErrorMessage = this.cleanErrorMessage(backendError);
        return;
      }

      this.editModalErrorMessage = this.extractErrorMessage(error) || 'Error updating complementary task category.';
    } catch (e) {
      this.editModalErrorMessage = this.extractErrorMessage(error) || 'Error updating complementary task category.';
    }
  }

  hasFieldError(fieldName: string): boolean {
    return !!this.fieldErrors[fieldName.toLowerCase()];
  }

  getFieldError(fieldName: string): string {
    return this.fieldErrors[fieldName.toLowerCase()] || '';
  }

  hasEditFieldError(fieldName: string): boolean {
    return !!this.editFieldErrors[fieldName.toLowerCase()];
  }

  getEditFieldError(fieldName: string): string {
    return this.editFieldErrors[fieldName.toLowerCase()] || '';
  }
}
