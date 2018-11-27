import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { RouterModule } from '@angular/router';

// Modules
import { SharedModule } from 'app/shared.module';

// Components
import { ApplicationsComponent } from './applications.component';
import { ApplistListComponent } from './applist-list/applist-list.component';
import { ApplistMapComponent } from './applist-map/applist-map.component';
import { ApplistFiltersComponent } from './applist-filters/applist-filters.component';
import { ApplistDetailComponent } from './applist-detail/applist-detail.component';
import { AppDetailPopupComponent } from './app-detail-popup/app-detail-popup.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule.forRoot(),
    NgxPaginationModule,
    RouterModule,
    SharedModule
  ],
  declarations: [
    ApplicationsComponent,
    ApplistListComponent,
    ApplistMapComponent,
    ApplistFiltersComponent,
    ApplistDetailComponent,
    AppDetailPopupComponent
  ],
  entryComponents: [
    AppDetailPopupComponent
  ]
})

export class ApplicationsModule { }
