import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('../pages/operationPlan/operationPlan').then(m => m.OperationPlan),
    data: {
      title: 'Operation Plans'
    }
  }
];
