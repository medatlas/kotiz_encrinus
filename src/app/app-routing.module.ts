import { AuthGuard } from './service/auth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DocumentListComponent } from './ui/document.list';

const routes: Routes = [{ path: '', redirectTo: '/', pathMatch: 'full' },
{
  path: 'docs', component: DocumentListComponent, canActivate: [AuthGuard]
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
