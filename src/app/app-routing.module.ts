import { AuthGuard } from './guards/auth.guard';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule), canActivate: [AuthGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./core/login/login.module').then(m => m.LoginPageModule)
  },

  {
    path: 'register2',
    loadChildren: () => import('./core/register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full'
  },
  {
    path: 'verify-email',
    loadChildren: () => import('./core/verify-email/verify-email.module').then(m => m.VerifyEmailPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./core/forgot-password/forgot-password.module').then(m => m.ForgotPasswordPageModule)
  },
  // {
  //   path: 'chat',
  //   loadChildren: () => import('./content/chat/chat.module').then(m => m.ChatPageModule)
  // },
  {
    path: 'welcome',
    loadChildren: () => import('./content/welcome/welcome.module').then(m => m.WelcomePageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./content/signup/signup.module').then(m => m.SignupPageModule)
  },
  {
    path: 'mainscreen',
    loadChildren: () => import('./content/mainscreen/mainscreen.module').then( m => m.MainscreenPageModule)
  },
  {
    path: 'get-pre-approved',
    loadChildren: () => import('./content/get-pre-approved/get-pre-approved.module').then( m => m.GetPreApprovedPageModule)
  },
  {
    path: 'pre-approved-result/:result',
    loadChildren: () => import('./content/pre-approved-result/pre-approved-result.module').then( m => m.PreApprovedResultPageModule)
  },
  {
    path: 'hire-real-state-agent',
    loadChildren: () => import('./content/hire-real-state-agent/hire-real-state-agent.module').then( m => m.HireRealStateAgentPageModule)
  },
  {
    path: 'shop-your-home',
    loadChildren: () => import('./content/shop-your-home/shop-your-home.module').then( m => m.ShopYourHomePageModule)
  },
  {
    path: 'get-your-home-inspected',
    loadChildren: () => import('./content/get-your-home-inspected/get-your-home-inspected.module')
    .then( m => m.GetYourHomeInspectedPageModule)
  },
  {
    path: 'close-your-new-home',
    loadChildren: () => import('./content/close-your-new-home/close-your-new-home.module').then( m => m.CloseYourNewHomePageModule)
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
