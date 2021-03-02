//reducer is a pure function
import { initialState } from "./counter.state";
import { createReducer, on } from "@ngrx/store"; //calculating
import { changeChannelName, customIncrement, decrement, increment,reset } from "./counter.actions";


const _counterReducer = createReducer(
  initialState,
  on(increment, (state) => {
    return {
      ...state, //copy old state
      counter:state.counter+1 ,  //then change the state immutably
    };
  }),
  on(decrement,(state) => {
    return {
      ...state, //copy old state
      counter:state.counter - 1 ,  //then change the state immutably
    };
  }),
  on(reset,(state)=>{
    return {
      ...state,
      counter: 0,
    };
  }),
  on(customIncrement,(state,action)=>{
    console.log(action)
    return {
      ...state,
      counter:state.counter + action.count,
    }
  }),
  on(changeChannelName,state=>{
    return {
      ...state,
      channelName:'Modified Neslin Jr Dev',
    }
  })
);

export function counterReducer(state, action) {
  return _counterReducer(state, action);
}
