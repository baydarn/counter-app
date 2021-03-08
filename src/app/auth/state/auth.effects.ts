import { catchError, exhaustMap, map, mergeMap, tap } from 'rxjs/operators';
import { autoLogin, autoLogout, loginStart, loginSuccess, signupStart, signupSuccess } from './auth.actions';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { AuthService } from "src/app/services/auth.service";
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { setErrorMessage, setLoadingSpinner } from 'src/app/store/Shared/shared.actions';
import { of } from 'rxjs';
import { Router } from '@angular/router';


@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private store:Store<AppState>,
    private router: Router
    ) {}

  login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loginStart),
      exhaustMap((action) => {
        return this.authService.login(action.email, action.password).pipe(
          map((data) => {
            this.store.dispatch(setLoadingSpinner({ status:false }));
            this.store.dispatch(setErrorMessage({ message: ''}));
            const user = this.authService.formatUser(data);
            this.authService.setUserInLocalStorage(user);   //implementing auto Login functionality
            return loginSuccess({ user, redirect: true });
          }),
          catchError((errResp) => {
            this.store.dispatch(setLoadingSpinner({ status: false }));
            const errorMessage = this.authService.getErrorMessage(errResp.error.error.message);
            return of(setErrorMessage({ message: errorMessage})); //catchError won't written any observable so we'll return a dummy observable.
          })
        );
      })
    );
  });



  loginRedirect$ = createEffect(() => {
    return this.actions$.pipe( //pipe fonksiyonunda veri akışını sağlarız
      ofType(...[loginSuccess,signupSuccess]), // signUpRedirect için yazdığımız effect'i kaldırıp bu şekilde yazabiliriz.
      tap((action) => {
        this.store.dispatch(setErrorMessage( {message: ''}));
        if(action.redirect){
          this.router.navigate(['/']);
        }
    })) ///pipe işlemi tamamlandıktan sonra observable'a subscribe olarak akış başlatılır.
  },
  { dispatch:false }
  );



  signUp$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(signupStart),
      exhaustMap(action => {
      return this.authService.signUp(action.email,action.password)
      .pipe(map((data)=>{ ///map operatörü ile observable'dan yayılan değerleri yeni bir observable içinde dönüştürüyoruz.
        this.store.dispatch(setLoadingSpinner({ status: false}));
        const user = this.authService.formatUser(data);
        return signupSuccess({user, redirect:true});
      }),catchError((errResp) => { //hata yakalama operatörü
        this.store.dispatch(setLoadingSpinner({ status: false }));
        const errorMessage = this.authService.getErrorMessage(errResp.error.error.message);
        return of(setErrorMessage({ message: errorMessage})); //catchError won't written any observable so we'll return a dummy observable.
      })
      );
    }))
  })

  autoLogin$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(autoLogin),
      mergeMap((action) => {
        const user = this.authService.getUserFromLocalStorage();
        return of(loginSuccess({ user,redirect:false }));
      })
    );
  });
  logout$ = createEffect(() =>{
    return this.actions$.pipe(
      ofType(autoLogout),
      map( (action) =>{
        this.authService.logout();
        this.router.navigate(['auth']);
    }))
  },{ dispatch:false });
}



