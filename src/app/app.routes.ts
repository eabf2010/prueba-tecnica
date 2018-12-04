import { RouterModule, Routes } from '@angular/router';
import {
  PostComponent,
  UsersComponent,
  CommentsComponent
} from './components/index.pag';

const app_routes: Routes = [
  { path: 'post', component: PostComponent },
  { path: 'users', component: UsersComponent },
  { path: 'comments', component: CommentsComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'post' }
];

export const app_routing = RouterModule.forRoot(app_routes, { useHash:true });
