import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private _http : HttpClient
  ) { }

  getUsers(){
    return this._http.get("http://localhost:3000/user/getUsers");
  }

  createGroup(data){
    return this._http.post("http://localhost:3000/group/createGroup",data);
  }

  getMyGroups(data){
    return this._http.post("http://localhost:3000/group/getByUserId",data);
  }

  getGroupInfo(data){
    return this._http.post("http://localhost:3000/group/getByGroupId",data);
  }

  createExpense(data){
    return this._http.post("http://localhost:3000/expense/createExpense",data);
  }

  getExpense(data){
    return this._http.post("http://localhost:3000/expense/getByGroupId",data);
  }

  deleteExpense(data){
    return this._http.post("http://localhost:3000/expense/deleteExpense",data);
  }

  getExpenseById(data){
    return this._http.post("http://localhost:3000/expense/getByExpenseId",data);
  }

  updateExpense(data){
    return this._http.post("http://localhost:3000/expense/updateExpense",data);
  }

  getHistory(data){
    return this._http.post("http://localhost:3000/history/getHistory",data);
  }
}
