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

  getUsers(data){
    // return this._http.post("http://localhost:3000/user/getUsers",data);
    return this._http.post("http://api.shubhamthorvetest.in/user/getUsers",data);
  }

  createGroup(data){
    // return this._http.post("http://localhost:3000/group/createGroup",data);
    return this._http.post("http://api.shubhamthorvetest.in/group/createGroup",data);
  }

  getMyGroups(data){
    // return this._http.post("http://localhost:3000/group/getByUserId",data);
    return this._http.post("http://api.shubhamthorvetest.in/group/getByUserId",data);
  }

  getGroupInfo(data){
    // return this._http.post("http://localhost:3000/group/getByGroupId",data);
    return this._http.post("http://api.shubhamthorvetest.in/group/getByGroupId",data);
  }

  createExpense(data){
    // return this._http.post("http://localhost:3000/expense/createExpense",data);
    return this._http.post("http://api.shubhamthorvetest.in/expense/createExpense",data);
  }

  getExpense(data){
    // return this._http.post("http://localhost:3000/expense/getByGroupId",data);
    return this._http.post("http://api.shubhamthorvetest.in/expense/getByGroupId",data);
  }

  deleteExpense(data){
    // return this._http.post("http://localhost:3000/expense/deleteExpense",data);
    return this._http.post("http://api.shubhamthorvetest.in/expense/deleteExpense",data);
  }

  getExpenseById(data){
    // return this._http.post("http://localhost:3000/expense/getByExpenseId",data);
    return this._http.post("http://api.shubhamthorvetest.in/expense/getByExpenseId",data);
  }

  updateExpense(data){
    // return this._http.post("http://localhost:3000/expense/updateExpense",data);
    return this._http.post("http://api.shubhamthorvetest.in/expense/updateExpense",data);
  }

  getHistory(data){
    // return this._http.post("http://localhost:3000/history/getHistory",data);
    return this._http.post("http://api.shubhamthorvetest.in/history/getHistory",data);
  }
}
