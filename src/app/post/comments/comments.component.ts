import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommentsService } from '../../services/comments.service';
import { Injectable } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {

  comments: any;
  displayedColumns = ['profile', 'comment', 'date'];
  dataSource = new CommentDataSource(this.api);

  commentForm: FormGroup;
  comment: string='';
  postID;


  constructor(private route: ActivatedRoute, private api: CommentsService, private router: Router, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.getCommentDetails(localStorage.getItem("postID"));
    this.postID = localStorage.getItem("postID");

    this.api.getCommentPostId(localStorage.getItem("postID"))
      .subscribe(res => {
        this.comments = res;
      }, err => {
        console.log(err);
        if(err.status=401){
          this.router.navigate(['login']);
        }
      });

    this.commentForm = this.formBuilder.group({
      'post_id' : [null],
      'profile_id' : [null],
      'comment' : [null, Validators.required]
    });
  }

  getCommentDetails(id) {
    this.api.getCommentPostId(id)
      .subscribe(data => {
        this.comments = data;
      });
  }

  onFormSubmit(form) {
    form.post_id = this.postID;
    form.profile_id = "Test";
    this.api.postComment(form)
      .subscribe(res => {
          let id = res['_id'];
          location.reload(true); // Page refresh
        }, (err) => {
          console.log(err);
        });
  }
}

export class CommentDataSource extends DataSource<any> {
  constructor(private api: CommentsService) {
    super()
  }

  connect() {
    console.log(this.api);
    return this.api.getCommentPostId(localStorage.getItem("postID"));
  }

  disconnect() {

  }
}