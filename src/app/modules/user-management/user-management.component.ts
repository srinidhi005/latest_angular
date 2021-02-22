
import { Component, Inject, OnInit } from '@angular/core';
import { error } from 'protractor';
import { AuthService } from '../../auth.service';
import { CommonModule } from '@angular/common';
import { UrlConfigService } from 'src/app/shared/url-config.service';
import { RMIAPIsService } from 'src/app/shared/rmiapis.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { generatePassword, Preferences } from '@password-generator/package';
import { MatRadioModule } from '@angular/material/radio';
  
@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent implements OnInit {
  constructor(
    public authService: AuthService,
    private urlConfig: UrlConfigService,
    private apiService: RMIAPIsService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    private modalService: NgbModal
  ) {}

  usersList;
  roleName;
  MappedUsers;
  progressBar = false;
  showCreateUser: any = false;
  loggedInUserDetails = {} as any;
  loggedInUserId = localStorage.getItem('loggedInUserId');

  newUserRoles = ["User", "Admin"];

  user = {
    email: '',
    connection: 'Username-Password-Authentication',
    password: '',
  };

  assignedRole = 'User'

  emailToolTip = 'format the email';
  passwordToolTip = 'passwordStrength';

  preferences : Preferences = {
    length: 9,
    initialText: 'abc',
    useChars: {
      pronounceable: false,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: false,
    },
  }

  ngOnInit(): void {
    this.progressBar = true;
    this.loggedInUserDetails.nickname = localStorage.getItem('nickname');
    this.loggedInUserDetails.email = localStorage.getItem('email');
    this.loggedInUserDetails.picture = localStorage.getItem('picture');
    this.loggedInUserDetails.role = localStorage.getItem('role');
    this.apiService
      .getData(this.urlConfig.getUserAdminAPI() + this.loggedInUserId)
      .subscribe(
        (res) => {
          console.log('fetched Users Succesfully', res, this.loggedInUserId);
          this.MappedUsers = res;
          //fetching all the users
          this.authService.getActiveUsers().subscribe(
            (response: any) => {
              console.log('fetched Users Succesfuly without c', response);
              this.progressBar = false;
              if (response['body'] && response['body'].length > 0) {
                if (this.authService.currentUserRoles[0] == 'SuperAdmin') {
                  this.usersList = response['body'].filter((usermap) => {
                    const userexist =
                      this.loggedInUserDetails.nickname == usermap.nickname;
                    return !userexist;
                  });
                } else {
                  this.usersList = response['body'].filter((usermap) => {
                    const userexist = this.MappedUsers.find(
                      (u) => u.inviteduser === usermap.user_id
                    );
                    return userexist;
                  });
                }
              }
            },
            (error) => {
              this.progressBar = false;
              console.log('failed to fetch the Users', error);
            }
          );
        },
        (error) => {
          this.progressBar = false;
          console.log('failed to fetch the Users', error);
        }
      );
  }

  getShowAddUser(type) {
    if (type == 'add') {
      this.showCreateUser = true;
    } else {
      this.showCreateUser = false;
    }
  }

  changePas(){
    this.authService.changePassword(this.loggedInUserDetails.email).subscribe(res => {
      console.log("RES", res);
    }, error => {
      console.log("error", error);
    })
  }

  deleteUser(index) {
    const toBeDeletedUser = this.usersList.splice(index, 1)[0];
    //deleting user from the auth0
    this.authService.deleteUser(toBeDeletedUser.user_id).subscribe(
      (res) => {
        console.log('auth0Del', res);
        if (true) {
          //user succesfully deleted from auth0

          // now deleting user mapping from DB

          this.apiService
            .getData(
              this.urlConfig.getdeleteAPI() +
                toBeDeletedUser.user_id +
                '&email=' +
                toBeDeletedUser.email
            )
            .subscribe(
              (response) => {
                console.log('deleteuserresponse', response);
              },
              (error) => {
                console.log('failed to delete the Users', error);
              }
            );
        }
      },
      (error) => {
        console.log('Unable to delete user from the auth0');
      }
    );
  }

  assignRoleToUser(user) {
    const role = this.authService.getRoleIdByRoleName(user.roleName);
    console.log('user', user);
    //updating the roles in app_metadata
    if (role) {
      this.authService.assignRolesToUser(role.id, user.user_id).subscribe(
        (res) => {
          console.log('userid', user.user_id);
          console.log(
            'Assigned role succesfully to the User ' + user.nickname,
            res
          );

          let body;

          if (user.app_metadata && user.app_metadata?.roles) {
            const name = [];
            name.push(user.roleName);
            user.app_metadata.roles = name;
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

  addRoleToUser(roleName, userObj) {
    userObj.roleName = roleName;
  }

  createUser() {
    if (!this.user.email) {
      return;
    }

    try {
      const password = generatePassword(this.preferences);
      console.log(password);
      this.user.password = password;

    } catch (error) {
      console.error(error.message)
      this.user.password = "qwT59JHgn";
    }


    this.authService.createUsers(this.user).subscribe(
      (res) => {
        console.log('Res', res); // will receive user json, consider user_id(created user id);
        if (true) {
          // make a db call to update the table
          this.apiService
            .getData(
              this.urlConfig.PostUserAdminAPI() +
                this.loggedInUserId +
                '&inviteduser=' +
                res['body']['user_id']
            )
            .subscribe(
              (response: any) => {
                this.progressBar = false;
                console.log('Response', response);
                let nameCapitalized  = "";
                if(this.authService.loggedInUserDetails){
                  nameCapitalized = this.authService.loggedInUserDetails.nickname.charAt(0).toUpperCase() + this.authService.loggedInUserDetails.nickname.slice(1) 
                }

                const reqBody = {
                  app_metadata: {
                    roles: [this.assignedRole],
                    password: this.user.password
                  },
                  user_metadata : {
                    invitedNickName: nameCapitalized
                  }
                };


                this.authService
                  .updateUsers(reqBody, res.body['user_id'])
                  .subscribe(
                    (update) => {
                      console.log('updateusers', update);
                      this.usersList.push(update.body);
                      this.openSnackBar('User created Successfully!');
                      const idOnly = res['body']['user_id'].indexOf("|");
                      const createdUserId : string = res['body']['user_id']
                      const reqBodyForEmail = {
                        "user_id": res['body']['user_id'],
                        "client_id": "lLtgZM1NooB3CBkugjhEcGT43kZH3XSS",
                        "identity": {
                          "user_id": createdUserId.slice((idOnly+1), res['body']['user_id'].length),
                          "provider": createdUserId.slice(0, idOnly)
                        }
                      }

                      this.authService.sendVerificationEmail(reqBodyForEmail).subscribe(resp => {
                        console.log("Email Sent Successfully", resp);
                        this.user = {
                          email: '',
                          connection: 'Username-Password-Authentication',
                          password: '',
                        };
                      }, error => {
                        console.log("Error while Send the mail", error);
                        this.user = {
                          email: '',
                          connection: 'Username-Password-Authentication',
                          password: '',
                        };
                      })
                    },

                    (error) => {
                      console.log('update the Users failed', error);
                    }
                  );
              },
              (error) => {
                this.progressBar = false;
                console.log('failed to fetch the Users', error);
                this.openSnackBar('Failed To Invite Users!');
                this.user = {
                  email: '',
                  connection: 'Username-Password-Authentication',
                  password: '',
                };
              }
            );
        }
      },
      (error) => {
        this.progressBar = false;
        console.log('Error While Creating User', error);
        this.openSnackBar('Failed to create the User!');
        this.user = {
          email: '',
          connection: 'Username-Password-Authentication',
          password: '',
        };
      }
    );
  }
  openSnackBar(message) {
    const snackb = this.snackBar.open(message, 'Ok', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });

    console.log("snackb", snackb);
  }
  getRole(user) {
    let role = '';
    if (user['roleName']) {
      role = user['roleName'];
    } else {
      role = 'select';
    }
    return role;
  }
  openPopUpModal(content) {
    this.modalService.open(content, { centered: true });
  }
}
