import { Injectable } from '@angular/core';
import createAuth0Client from '@auth0/auth0-spa-js';
import Auth0Client from '@auth0/auth0-spa-js/dist/typings/Auth0Client';
import { from, of, Observable, BehaviorSubject, combineLatest, throwError, Subject } from 'rxjs';
import { tap, catchError, concatMap, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HttpClient, HttpRequest, HttpParams, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loggedInUserRoles;
  loggedInUserId;
  loggedInUserDetails;
  currentUserRoles = []
  profileSubscriber = new Subject();
  isAdmin: boolean;
  roleNames = ['SuperAdmin','User','Admin',];
 //url="https://example.com/roles";
 apiToken="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImZNNTdKWW9md0lUZXJfU0JrNGxsbyJ9.eyJpc3MiOiJodHRwczovL3JtaS1pbnNpZ2h0cy51cy5hdXRoMC5jb20vIiwic3ViIjoiNlFjU3AyMmhDYmVJeHMwVHU1SEhTcWRJcGt1d2tmdFpAY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vcm1pLWluc2lnaHRzLnVzLmF1dGgwLmNvbS9hcGkvdjIvIiwiaWF0IjoxNjExNjc2ODkzLCJleHAiOjE2MTQyNjg4OTMsImF6cCI6IjZRY1NwMjJoQ2JlSXhzMFR1NUhIU3FkSXBrdXdrZnRaIiwic2NvcGUiOiJyZWFkOmNsaWVudF9ncmFudHMgY3JlYXRlOmNsaWVudF9ncmFudHMgZGVsZXRlOmNsaWVudF9ncmFudHMgdXBkYXRlOmNsaWVudF9ncmFudHMgcmVhZDp1c2VycyB1cGRhdGU6dXNlcnMgZGVsZXRlOnVzZXJzIGNyZWF0ZTp1c2VycyByZWFkOnVzZXJzX2FwcF9tZXRhZGF0YSB1cGRhdGU6dXNlcnNfYXBwX21ldGFkYXRhIGRlbGV0ZTp1c2Vyc19hcHBfbWV0YWRhdGEgY3JlYXRlOnVzZXJzX2FwcF9tZXRhZGF0YSByZWFkOnVzZXJfY3VzdG9tX2Jsb2NrcyBjcmVhdGU6dXNlcl9jdXN0b21fYmxvY2tzIGRlbGV0ZTp1c2VyX2N1c3RvbV9ibG9ja3MgY3JlYXRlOnVzZXJfdGlja2V0cyByZWFkOmNsaWVudHMgdXBkYXRlOmNsaWVudHMgZGVsZXRlOmNsaWVudHMgY3JlYXRlOmNsaWVudHMgcmVhZDpjbGllbnRfa2V5cyB1cGRhdGU6Y2xpZW50X2tleXMgZGVsZXRlOmNsaWVudF9rZXlzIGNyZWF0ZTpjbGllbnRfa2V5cyByZWFkOmNvbm5lY3Rpb25zIHVwZGF0ZTpjb25uZWN0aW9ucyBkZWxldGU6Y29ubmVjdGlvbnMgY3JlYXRlOmNvbm5lY3Rpb25zIHJlYWQ6cmVzb3VyY2Vfc2VydmVycyB1cGRhdGU6cmVzb3VyY2Vfc2VydmVycyBkZWxldGU6cmVzb3VyY2Vfc2VydmVycyBjcmVhdGU6cmVzb3VyY2Vfc2VydmVycyByZWFkOmRldmljZV9jcmVkZW50aWFscyB1cGRhdGU6ZGV2aWNlX2NyZWRlbnRpYWxzIGRlbGV0ZTpkZXZpY2VfY3JlZGVudGlhbHMgY3JlYXRlOmRldmljZV9jcmVkZW50aWFscyByZWFkOnJ1bGVzIHVwZGF0ZTpydWxlcyBkZWxldGU6cnVsZXMgY3JlYXRlOnJ1bGVzIHJlYWQ6cnVsZXNfY29uZmlncyB1cGRhdGU6cnVsZXNfY29uZmlncyBkZWxldGU6cnVsZXNfY29uZmlncyByZWFkOmhvb2tzIHVwZGF0ZTpob29rcyBkZWxldGU6aG9va3MgY3JlYXRlOmhvb2tzIHJlYWQ6YWN0aW9ucyB1cGRhdGU6YWN0aW9ucyBkZWxldGU6YWN0aW9ucyBjcmVhdGU6YWN0aW9ucyByZWFkOmVtYWlsX3Byb3ZpZGVyIHVwZGF0ZTplbWFpbF9wcm92aWRlciBkZWxldGU6ZW1haWxfcHJvdmlkZXIgY3JlYXRlOmVtYWlsX3Byb3ZpZGVyIGJsYWNrbGlzdDp0b2tlbnMgcmVhZDpzdGF0cyByZWFkOnRlbmFudF9zZXR0aW5ncyB1cGRhdGU6dGVuYW50X3NldHRpbmdzIHJlYWQ6bG9ncyByZWFkOmxvZ3NfdXNlcnMgcmVhZDpzaGllbGRzIGNyZWF0ZTpzaGllbGRzIHVwZGF0ZTpzaGllbGRzIGRlbGV0ZTpzaGllbGRzIHJlYWQ6YW5vbWFseV9ibG9ja3MgZGVsZXRlOmFub21hbHlfYmxvY2tzIHVwZGF0ZTp0cmlnZ2VycyByZWFkOnRyaWdnZXJzIHJlYWQ6Z3JhbnRzIGRlbGV0ZTpncmFudHMgcmVhZDpndWFyZGlhbl9mYWN0b3JzIHVwZGF0ZTpndWFyZGlhbl9mYWN0b3JzIHJlYWQ6Z3VhcmRpYW5fZW5yb2xsbWVudHMgZGVsZXRlOmd1YXJkaWFuX2Vucm9sbG1lbnRzIGNyZWF0ZTpndWFyZGlhbl9lbnJvbGxtZW50X3RpY2tldHMgcmVhZDp1c2VyX2lkcF90b2tlbnMgY3JlYXRlOnBhc3N3b3Jkc19jaGVja2luZ19qb2IgZGVsZXRlOnBhc3N3b3Jkc19jaGVja2luZ19qb2IgcmVhZDpjdXN0b21fZG9tYWlucyBkZWxldGU6Y3VzdG9tX2RvbWFpbnMgY3JlYXRlOmN1c3RvbV9kb21haW5zIHVwZGF0ZTpjdXN0b21fZG9tYWlucyByZWFkOmVtYWlsX3RlbXBsYXRlcyBjcmVhdGU6ZW1haWxfdGVtcGxhdGVzIHVwZGF0ZTplbWFpbF90ZW1wbGF0ZXMgcmVhZDptZmFfcG9saWNpZXMgdXBkYXRlOm1mYV9wb2xpY2llcyByZWFkOnJvbGVzIGNyZWF0ZTpyb2xlcyBkZWxldGU6cm9sZXMgdXBkYXRlOnJvbGVzIHJlYWQ6cHJvbXB0cyB1cGRhdGU6cHJvbXB0cyByZWFkOmJyYW5kaW5nIHVwZGF0ZTpicmFuZGluZyBkZWxldGU6YnJhbmRpbmcgcmVhZDpsb2dfc3RyZWFtcyBjcmVhdGU6bG9nX3N0cmVhbXMgZGVsZXRlOmxvZ19zdHJlYW1zIHVwZGF0ZTpsb2dfc3RyZWFtcyBjcmVhdGU6c2lnbmluZ19rZXlzIHJlYWQ6c2lnbmluZ19rZXlzIHVwZGF0ZTpzaWduaW5nX2tleXMgcmVhZDpsaW1pdHMgdXBkYXRlOmxpbWl0cyBjcmVhdGU6cm9sZV9tZW1iZXJzIHJlYWQ6cm9sZV9tZW1iZXJzIGRlbGV0ZTpyb2xlX21lbWJlcnMiLCJndHkiOiJjbGllbnQtY3JlZGVudGlhbHMifQ.V30ZhBlyPII_GOyYeQHNS1Z99PhxdoS5nyT5M5CHqI53D4uN6ifq4wWnKoTlwXWiYjUQKdh3V8lDv5yLmQOfVOG7NOZ1GA-wNfDE5Wg-kVjqaVLbKmqe_sAtFyPVMJOYuNpdfEBOPohVahQRu79loIcYY6Gd55KDoWp2oM006Mk8JldOwXnXUjhGFjb4fTjlPSBBr6lEArnMak-WzLLdjbIPLoUJB2BL1ndxYHmniiBHr8i-fadadbltwjMb2esF0PQ-_8QTK9HpA8Lhb6z6g_o0_up7ubwt_06nktSQw2tB36Vn_uc61CRBPSeAoPVYHBwYZ7z6H1shtBpAlnnNyA"
 // Create an o/bservable of Auth0 instance of client
  auth0Client$ = (from(
    createAuth0Client({
      domain: "rmi-insights.us.auth0.com",
      client_id: "lLtgZM1NooB3CBkugjhEcGT43kZH3XSS",
      redirect_uri: "https://app.rmiinsights.com/statement",
       useRefreshTokens: true,
      cacheLocation: 'localstorage'
    })
  ) as Observable<Auth0Client>).pipe(
    shareReplay(1), // Every subscription receives the same shared value
    catchError(err => throwError(err))
  );
  // Define observables for SDK methods that return promises by default
  // For each Auth0 SDK method, first ensure the client instance is ready
  // concatMap: Using the client instance, call SDK method; SDK returns a promise
  // from: Convert that resulting promise into an observable
  isAuthenticated$ = this.auth0Client$.pipe(
    concatMap((client: Auth0Client) => from(client.isAuthenticated())),
    tap(res => this.loggedIn = res)
  );
  handleRedirectCallback$ = this.auth0Client$.pipe(
    concatMap((client: Auth0Client) => from(client.handleRedirectCallback()))
  );
  // Create subject and public observable of user profile data
  // userProfileSubject$ = new BehaviorSubject<any>(null);
  userProfileSubject$ = new Subject();
  // userProfile$ = this.userProfileSubject$.asObservable();
  // Create a local property for login status
  loggedIn: boolean = null;
  roleIds=[];
  constructor(private router: Router,private http:HttpClient) {
    // On initial load, check authentication state with authorization server
    // Set up local auth streams if user is already authenticated
    this.localAuthSetup();
    // Handle redirect from Auth0 login
    this.handleAuthCallback();
    this.fetchRoleIds();
  }
   async fetchRoleIds(){
    this.roleIds = [];
    for(let i=0;i<this.roleNames.length;i++){
      const data=await this.getRoleId$(this.roleNames[i]).toPromise()
      this.roleIds.push(data.body[0]);
    }
    console.log("Fetched role ids for user, admin and superAdmin",this.roleIds);
   }


   getRoleIdByRoleName(roleName){
      const selectedRole = this.roleIds.find( role => role.name === roleName );
      return selectedRole ? selectedRole : null;
   }


 
  // When calling, options can be passed if desired
  // https://auth0.github.io/auth0-spa-js/classes/auth0client.html#getuser
  getUser$(options?): Observable<any> {
    this.userProfileSubject$.subscribe((res: any)=>{
      console.log("res for profile",res);
	  this.loggedInUserId=res.sub;
	  this.loggedInUserDetails=res;
	  localStorage.setItem("loggedInUserId",this.loggedInUserId)
	  localStorage.setItem("loggedInUserDetails",this.loggedInUserDetails)
	  
      // this._setSession(res);
      this.getUserRoles$(res.sub).subscribe((response : any)=>{
        console.log("fetched user role for "+ res.sub ,response)
		
		
		
		const emailId = res.email
const employer = emailId.substring(emailId.lastIndexOf('@') + 1, emailId.lastIndexOf('.'));

			if(employer.toLowerCase() == "rmiinsights"){
            const userRoleId = this.getRoleIdByRoleName('SuperAdmin');
            this.assignRolesToUser(userRoleId.id, res.sub).subscribe(
              (id) => {
                const body = { app_metadata: { roles: ['SuperAdmin'] } };
                this.updateUsers(body, res.sub).subscribe((update) => {
                  console.log('updateusers', this.updateUsers);
                });
                console.log('Assigned User role by default', id);
                this.currentUserRoles = ['SuperAdmin'];
				localStorage.setItem("role","SuperAdmin");
                this.loggedInUserRoles = [
                  this.roleIds.find((rName) => rName === 'SuperAdmin'),
                ];
              },
              (error) => {
                console.log('err', error);
              }
            );
          }
		
		
		
		
		
       else if(response.body?.length > 0){
          this.loggedInUserRoles = response.body;
		  
          this.currentUserRoles = this.loggedInUserRoles.map( role => role.name);
		  for(let i=0;i<this.currentUserRoles.length;i++){
			  const role=this.currentUserRoles[i]
			   if(this.currentUserRoles.indexOf("SuperAdmin") >= 0){
	   localStorage.setItem("role","SuperAdmin")
	   break;
	   }
	   else if(this.currentUserRoles.indexOf("Admin") >= 0){
	   localStorage.setItem("role","Admin")
	   break;
	   }
	   else if(this.currentUserRoles.indexOf("User") >= 0){
	  localStorage.setItem("role","User")
	   break;
	   }
	   else{
		   continue;
	   }
		  }
          console.log("currentUserRoles", this.currentUserRoles, this.loggedInUserRoles);
       }
       else{
          const userRoleId = this.getRoleIdByRoleName("User")
          this.assignRolesToUser(userRoleId.id, res.sub).subscribe((id)=>{
          const body = {"app_metadata":{"roles":["User"]}}
		  this.updateUsers(body,res.sub).subscribe((update)=>{
		  console.log("updateusers",this.updateUsers)})
			console.log("Assigned User role by default",id)
            this.currentUserRoles = ["User"]
            this.loggedInUserRoles = [this.roleIds.find(rName => rName=== "User")]
          },error=>{
            console.log("err",error)
          })
        }
      },error=>{
        console.log("Failed to Fetch the user Role for "+ res.sub,error)
      })
 
 
      console.log("user",res.user_metadata);
      localStorage.setItem('nickname',res.nickname);
      localStorage.setItem('email',res.email);
      localStorage.setItem('picture',res.picture);
	  
      this.profileSubscriber.next()
    });

    return this.auth0Client$.pipe(
      concatMap((client: Auth0Client) => from(client.getUser(options))),
      tap(user => this.userProfileSubject$.next(user))
    );
  }

  createUsers(body) {
    const url = `https://rmi-insights.us.auth0.com/api/v2/users`;
    return this.http.post(url, body, {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this.apiToken}`
      ),
      observe: 'response',
    });
  }

  getUserRoles$(userID: string) {
    const url=`https://rmi-insights.us.auth0.com/api/v2/users/${userID}/roles`
    return this.http.get(
      url, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${this.apiToken}`)
    ,observe:"response"});
 
}

getRoleId$(Rolename: string) {

 const url=`https://rmi-insights.us.auth0.com/api/v2/roles?name_filter=`+Rolename
   return this.http.get(
    url, {
    headers: new HttpHeaders().set('Authorization', `Bearer ${this.apiToken}`)
  ,observe:"response"});
 
}


getActiveUsers(){
  const url=`https://rmi-insights.us.auth0.com/api/v2/users`;
  return this.http.get(url, {headers: new HttpHeaders().set('Authorization', `Bearer ${this.apiToken}`),observe:"response"});
}

updateUsers(body,userId){
const url=`https://rmi-insights.us.auth0.com/api/v2/users/${userId}`;
 return this.http.patch(
    url, body,{
    headers: new HttpHeaders().set('Authorization', `Bearer ${this.apiToken}`)
  ,observe:"response"});
}
///DeleteUsers
deleteUser(userId) {
    const url = `https://rmi-insights.us.auth0.com/api/v2/users/` + userId;
    return this.http.delete(url, {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this.apiToken}`
      ),
      observe: 'response',
    });
  }

assignRolesToUser(roleId: string, userId: string){
  const url=`https://rmi-insights.us.auth0.com/api/v2/users/${userId}/roles`;
  const inputBody = {
    roles: [
      roleId
    ]
  }
  return this.http.post(url, inputBody, {headers: new HttpHeaders().set('Authorization', `Bearer ${this.apiToken}`),observe:"response"});
}

  private localAuthSetup() {
    // This should only be called on app initialization
    // Set up local authentication streams
    const checkAuth$ = this.isAuthenticated$.pipe(
      concatMap((loggedIn: boolean) => {
        if (loggedIn) {
          // If authenticated, get user and set in app
          // NOTE: you could pass options here if needed
          return this.getUser$();
        }
        // If not authenticated, return stream that emits 'false'
        return of(loggedIn);
      })
    );
    checkAuth$.subscribe();
  }

			  login(redirectPath: string = 'https://app.rmiinsights.com/') {
    // A desired redirect path can be passed to login method
    // (e.g., from a route guard)
    // Ensure Auth0 client instance exists
    this.auth0Client$.subscribe((client: Auth0Client) => {
      // Call method to log in
      client.loginWithRedirect({
      redirect_uri: `${window.location.origin+"/statement"}`,
        appState: { target: redirectPath }
      });
    });
  }
 
 
 

  private handleAuthCallback() {
    // Call when app reloads after user logs in with Auth0
    const params = window.location.search;
    if (params.includes('code=') && params.includes('state=')) {
      let targetRoute: string; // Path to redirect to after login processsed
      const authComplete$ = this.handleRedirectCallback$.pipe(
        // Have client, now call method to handle auth callback redirect
        tap(cbRes => {
          // Get and set target redirect route from callback results
          targetRoute = cbRes.appState && cbRes.appState.target ? cbRes.appState.target : '/statement';
        }),
        concatMap(() => {
          // Redirect callback complete; get user and login status
          return combineLatest([
            this.getUser$(),
            this.isAuthenticated$
          ]);
        })
      );
      // Subscribe to authentication completion observable
      // Response will be an array of user and login status
      authComplete$.subscribe(([user, loggedIn]) => {
        // Redirect to target route after callback processing
        this.router.navigate([targetRoute]);
      });
    }
  }




  logout() {
    // Ensure Auth0 client instance exists
    this.auth0Client$.subscribe((client: Auth0Client) => {
      // Call method to log out
      client.logout({
        client_id: "lLtgZM1NooB3CBkugjhEcGT43kZH3XSS",
			  returnTo: "https://app.rmiinsights.com/"
      });
    });
  }

}
