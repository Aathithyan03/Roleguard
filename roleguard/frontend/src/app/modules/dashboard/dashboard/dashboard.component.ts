// src/app/modules/dashboard/dashboard/dashboard.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, forkJoin, takeUntil, finalize } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { RecordsService } from '../../../core/services/records.service';
import { AppRecord } from '../../../shared/models/record.model';
import { User } from '../../../shared/models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  currentUser: User | null = null;
  records: AppRecord[] = [];
  accessNote = '';
  loadingRecords = false;
  error = '';
  delayMs = 0;

  // Material table columns
  displayedColumns = ['title', 'category', 'status', 'priority', 'assignedTo', 'accessLevel'];

  // Stats computed from records
  get totalRecords()    { return this.records.length; }
  get completedCount()  { return this.records.filter(r => r.status === 'completed').length; }
  get inProgressCount() { return this.records.filter(r => r.status === 'in-progress').length; }
  get restrictedCount() { return this.records.filter(r => r.accessLevel === 'admin').length; }

  constructor(
    private authService: AuthService,
    private recordsService: RecordsService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;
    this.loadData();
  }

  loadData(delay = 0): void {
    this.loadingRecords = true;
    this.error = '';
    this.delayMs = delay;

    // forkJoin — parallel async calls; showcases async processing
    forkJoin({
      records: this.recordsService.getRecords(delay),
    })
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.loadingRecords = false))
      )
      .subscribe({
        next: ({ records }) => {
          this.records = records.data;
          this.accessNote = records.meta.accessNote;
        },
        error: (err) => {
          this.error = err?.error?.message || 'Failed to load records.';
        }
      });
  }

  refreshWithDelay(ms: number): void {
    this.records = [];
    this.loadData(ms);
  }

  statusClass(status: string): string {
    const map: Record<string, string> = {
      'completed':   'badge--green',
      'in-progress': 'badge--blue',
      'review':      'badge--amber',
      'pending':     'badge--gray',
    };
    return map[status] || 'badge--gray';
  }

  priorityClass(priority: string): string {
    const map: Record<string, string> = {
      'critical': 'badge--red',
      'high':     'badge--orange',
      'medium':   'badge--amber',
      'low':      'badge--gray',
    };
    return map[priority] || 'badge--gray';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
