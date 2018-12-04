import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgForm } from '@angular/forms'
import { ActivatedRoute } from "@angular/router";
import { DbService } from '../../services/db.service';

declare const $:any;
declare const jQuery:any;
declare const md:any;

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {

  arrayComments:any = [];
  arrayPost:any = [];
  
  commentsForm:FormGroup;
  commentsFormEdit:FormGroup;
  commentsFormErrors:any;
  commentsFormEditErrors:any;
  sending:boolean = false;
  watchComment:boolean = false;
  commentSelected:string = null;
  afterEdit:boolean = true;
  postData:any = null;
  idComment:any = null;
  commentDataEmail:any = null;  
  commentDataName:any = null;
  commentDataBody:any = null;


  public comments:any = {
    postId:"",
    name:"",
    email:"",
    body:null
  }

  public commentsEdit:any = {
    name:"",
    email:"",
    body:null
  }

  constructor( private route:ActivatedRoute,
               private _dbService: DbService,
               private formBuilder: FormBuilder ) { 

    this.commentsFormErrors = {
            postId    : {},
            name      : {},
            email     : {},
            body      : {}
    };

    this.commentsFormEditErrors = {
            name      : {},
            email     : {},
            body      : {}
    };
  }

  ngOnInit() {

  	this._dbService.loadComments( )
          .subscribe( res => {
            this.arrayComments = res;
            if( this.arrayComments.length == 0 )
              //lugar, alinacion, tipo, icono, mensaje, duracion
              md.showNotification('top','center','danger','warning','Parece que no hay comments!',500);
          });

    this._dbService.loadPost( )
          .subscribe( data => {
            this.arrayPost = data;
          });

    this.commentsForm = this.formBuilder.group({
            postId       : ['', Validators.required],
            name       : ['', Validators.required],
            email      : ['', [Validators.required, Validators.email]],
            body       : ['', Validators.required,]
    });

    this.commentsFormEdit = this.formBuilder.group({
            name       : ['', Validators.required],
            email      : ['', [Validators.required, Validators.email]],
            body       : ['', Validators.required,]
    });

    this.commentsForm.valueChanges.subscribe(() => {
        this.onRegisterFormValuesChanged();
    });

    this.commentsFormEdit.valueChanges.subscribe(() => {
        this.onRegisterFormValuesChangedEdit();
    });

  }


  onRegisterFormValuesChanged()
    {
        for ( const field in this.commentsFormErrors )
        {
            if ( !this.commentsFormErrors.hasOwnProperty(field) )
            {
                continue;
            }

            this.commentsFormErrors[field] = {};

            const control = this.commentsForm.get(field);

            if ( control && control.dirty && !control.valid )
            {
                this.commentsFormErrors[field] = control.errors;
            }
        }
    }
  
  //para hacer refresh de los comments luego de una accion
  reloadComment(){
    this.sending = false;
    this._dbService.loadComments( )
          .subscribe( data => {
            this.arrayComments = data;
          });
  }

  //eliminar comment
  deleteComments( idComment ){
    this._dbService.deleteComment( idComment )
          .subscribe( data => {
            this.reloadComment();
            md.showNotification('top','center','rose','block','El comment ha sido eliminado',500);
          });
  }
  

  //edicion de comment
  editComment( idComment ){

    this.afterEdit = false;
    this.idComment = idComment;
    this.watchComment = true;
    this.commentSelected = 'Edicion de comment';

    this._dbService.loadPost( )
          .subscribe( data => {
            this.arrayPost = data;
          });

    this._dbService.findComment( idComment )
          .subscribe( data => {
            let dataComment = data.json();
            this.postData = Number(dataComment.postId);
            this.commentDataEmail = dataComment.email;  
            this.commentDataName = dataComment.name;            
            this.commentDataBody = dataComment.body;
          });

  }
  
  //boton volver
  previous(){
    this.afterEdit = true;
    this.watchComment = false;
  }
  

  //registro de nuevo comments
  newComment(){
    if( this.sending ){
      md.showNotification('top','center','danger','warning','Su operacion esta en proceso',200);
    }
    else{
      this.sending = true;

      let comment = {
        postId: Number(this.comments["postId"]),
        name:this.comments["name"],
        email: this.comments["email"],
        body: this.comments["body"]
      }
     
      this._dbService.registrarComment( comment )
              .subscribe( data=>{
                if( data.ok ){
                  this.commentsForm.reset();
                  this.reloadComment();
                  md.showNotification('top','center','primary','check','El comment ha sido creado!',500);
                }
                else{
                   md.showNotification('top','center','rose','block','El comment no pudo ser creado!',500);
                }
                this.previous();

      });  
    }
  }

  //edicion de comment
  editarComment( commentId ){

    if( this.sending ){
      md.showNotification('top','center','danger','warning','Su operacion esta en proceso',200);
    }
    else{
      this.sending = true;
    
    let commentEdit = {
        postId: Number($("#postId").val()),
        name: this.commentsEdit["name"],
        email: this.commentsEdit["email"],
        body: this.commentsEdit["body"]
      }
    
    this._dbService.editarComment( commentEdit, commentId )
              .subscribe( data=>{
                if( data.ok ){
                  this.afterEdit = true;
                  this.reloadComment();
                  md.showNotification('top','center','primary','check','El comment ha sido editado!',500);
                }
                else{
                   md.showNotification('top','center','rose','block','El comment no se pudo editar',500);
                }
                this.sending = false;

      });

    }

  }


  onRegisterFormValuesChangedEdit()
    {
        for ( const field in this.commentsFormEditErrors )
        {
            if ( !this.commentsFormEditErrors.hasOwnProperty(field) )
            {
                continue;
            }

            this.commentsFormEditErrors[field] = {};

            const control = this.commentsFormEdit.get(field);

            if ( control && control.dirty && !control.valid )
            {
                this.commentsFormEditErrors[field] = control.errors;
            }
        }
    }








}
