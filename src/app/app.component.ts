import { Component, OnInit } from '@angular/core';
import {
  SocialAuthService,
  FacebookLoginProvider,
  SocialUser,
} from 'angularx-social-login';
import { timeStamp } from 'console';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  currentStatus: string = 'all';
  #tasks = [
    {
      task: 'Complete online JavaScript course',
      status: 'complete',
    },

    {
      task: 'Jog around the park 3x',
      status: 'active',
    },
    {
      task: '10 minutes meditation',
      status: 'active',
    },
    {
      task: 'Read for 1 hour',
      status: 'active',
    },
    {
      task: 'Pick up groceries',
      status: 'active',
    },
    {
      task: 'Complete Todo App on Frontend Mentor',
      status: 'active',
    },
  ];
  mode: 'dark' | 'light' = 'dark';
  tasks = [...this.#tasks];
  swithModes() {
    this.mode = this.mode === 'light' ? 'dark' : 'light';
  }
  filterTasks(key: string) {
    this.currentStatus = key;
    if (key === 'all') {
      this.tasks = [...this.#tasks];
    } else {
      this.tasks = this.#tasks.filter((task) => task.status === key);
    }
  }
  completeTask(index: number) {
    console.log('index', index);
    const task = this.tasks[index];
    const i = this.#tasks.findIndex((e) => e.task === task.task);
    if (task.status !== 'complete') {
      task.status = 'complete';
    } else {
      task.status = 'active';
    }
    this.tasks[index] = task;
    this.#tasks[i] = task;
  }







  user: SocialUser;
  isSignedin: boolean = false;;

  constructor(
    private socialAuthService: SocialAuthService,
  ) {}

  ngOnInit() {


    this.socialAuthService.authState.subscribe((user) => {
      this.user = user;
      this.isSignedin = user != null;
      if(!this.isSignedin){
        this.logrrr()
      }

    });
  }
logrrr(){
  console.log('HHHHHHHHHHHHHHHH');
  
}

  facebookSignin(): void {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  logOut(): void {
    this.socialAuthService.signOut();
  }



  
}
