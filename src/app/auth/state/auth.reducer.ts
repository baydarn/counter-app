import { state } from "@angular/animations";
import { createReducer, on } from "@ngrx/store";
import { initialState } from "src/app/counter/state/counter.state";
import { autoLogout, loginSuccess, signupSuccess } from "./auth.actions";

const _authReducer = createReducer(
  initialState,
  on(loginSuccess,(state,action)=>{
    console.log(action );
  return {
    ...state,
    user:action.user,
  }
}),
on(signupSuccess,(state,action)=>{
  return {
    ...state,
    user:action,
  };
}), on(autoLogout, (state) => {
  return {
    ...state,
    user: null,
  };
})
);

export function AuthReducer(state,action){
  return _authReducer(state,action);
}
