import { Component, OnInit } from '@angular/core';
import { error } from 'protractor';
import { AuthService } from '../../auth.service';
import { CommonModule } from '@angular/common';
import { UrlConfigService } from 'src/app/shared/url-config.service';
import { RMIAPIsService } from 'src/app/shared/rmiapis.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {

  constructor(public authService : AuthService, private urlConfig: UrlConfigService,
    private apiService: RMIAPIsService) { }

  usersList;
  roleName;
	MappedUsers;
  showCreateUser : boolean = false;
  loggedInUserId=localStorage.getItem("loggedInUserId");
	
  user = {
    email: "",
    connection: "Username-Password-Authentication",
	password: "",
  }

  ngOnInit(): void {
	this.apiService.getData(this.urlConfig.getUserAdminAPI() + this.loggedInUserId).subscribe(
      (res) => {
		  
        console.log('fetched Users Succesfully', res,this.loggedInUserId);
		this.MappedUsers = res;
		//fetching all the users
    this.authService.getActiveUsers().subscribe(
			(response:any) => {console.log('fetched Users Succesfuly without c', response);
			if(response["body"] &&  response["body"].length > 0){
				this.usersList = response["body"].filter(usermap=>{
					const userexist = this.MappedUsers.find(u=>u.inviteduser === usermap.user_id )
					return userexist;
				});
			}
		},
      (error) => {
        console.log('failed to fetch the Users', error);
      });
      },
      (error) => {
        console.log('failed to fetch the Users', error);
      }
    );
    
  };

  assignRoleToUser(user) {
    const role = this.authService.getRoleIdByRoleName(user.roleName);
    console.log('user', user);
    //updating the roles in app_metadata
    if (role) {
      this.authService.assignRolesToUser(role.id, user.user_id).subscribe(
        (res) => {
          console.log('userid', user.user_id);
          console.log('Assigned role succesfully to the User ' + user.nickname,res);

          let body;

          if (user.app_metadata && user.app_metadata?.roles) {
            const name = [];
            name.push(user.roleName);
            user.app_metadata.roles = name
            body = { app_metadata: { roles: user.app_metadata.roles } };
          } else {
            const name = [];
            name.push(user.roleName);
            body = { app_metadata: { roles: name } };
          }

          this.authService.updateUsers(body, user.user_id).subscribe(
            (update) => {
              console.log('updateusers', update);
            },
            (error) => {
              console.log('update the Users failed', error);
            }
          );
        },
        (error) => {
          console.log(
            'Error While assigning role to User ' + user.nickname,
            error
          );
        }
      );
    }
  }

  createUser(){
    if(!this.user.email || !this.user.password){
      return
    }

    this.authService.createUsers(this.user).subscribe(res => {
      console.log("Res",  res); // will receive user json, consider user_id(created user id);
      if(true){
        // make a db call to update the table
		this.apiService.getData(this.urlConfig.PostUserAdminAPI() +this.loggedInUserId + "&inviteduser=" +res["body"]["user_id"]).subscribe(
		(response) => {
		 console.log("Response",  response);
		    this.usersList.push(res.body);         
		},
		(error) => {
			console.log('failed to fetch the Users', error);
		});
		};
		}, error => {
			console.log("Error While Creating User", error);
    });
  }
}