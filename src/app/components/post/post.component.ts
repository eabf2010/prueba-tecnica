import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgForm } from '@angular/forms'
import { ActivatedRoute } from "@angular/router";
import { DbService } from '../../services/db.service';

declare const $:any;
declare const jQuery:any;
declare const md:any;

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent {

	arrayPost:any = [];
  arrayPostComments:any = [];
  postForm:FormGroup;
  postFormEdit:FormGroup;
  postFormErrors:any;
  postFormEditErrors:any;
  arrayUsers:any = [];
  sending:boolean = false;
  watchPost:boolean = false;
  idPost:any = null;
  postData:any = null;
  postDataTitle:string = null;
  postDataBody:string = null;
  postSelected:string = null;
  afterEdit:boolean = true;

  public post:any = {
    userId:'',
    title:'',
    body:null
  }

  public postEdit:any = {
    title:'',
    body:null
  }

  constructor( private route:ActivatedRoute,
               private _dbService: DbService,
               private formBuilder: FormBuilder ) { 

    this.postFormErrors = {
            userId     : {},
            title      : {},
            body       : {}
    };

    this.postFormEditErrors = {
            title      : {},
            body       : {}
    };

  }

  ngOnInit() {
    
    //carga de los usuarios
    this._dbService.loadUsers( )
          .subscribe( res => {
            this.arrayUsers = res;
          });
    
    //carga de los posts
    this._dbService.loadPost( )
          .subscribe( data => {
            this.arrayPost = data;
            if( this.arrayPost.length == 0 )
              //lugar, alinacion, tipo, icono, mensaje, duracion
              md.showNotification('top','center','danger','warning','Parece que no hay posts aun!',500);
          });

    this.postForm = this.formBuilder.group({
            userId: ['', Validators.required],
            title       : ['', Validators.required],
            body       : ['', Validators.required,]
    });

    this.postFormEdit = this.formBuilder.group({
            title       : ['', Validators.required],
            body       : ['', Validators.required,]
    });

    this.postForm.valueChanges.subscribe(() => {
        this.onRegisterFormValuesChanged();
    });

    this.postFormEdit.valueChanges.subscribe(() => {
        this.onRegisterFormValuesChangedEdit();
    });

  }


  reloadPost(){
    this.sending = false;
    this._dbService.loadPost( )
          .subscribe( data => {
            this.arrayPost = data;
          });
  }


  deletePosts( idPost ){
    this._dbService.deletePost( idPost )
          .subscribe( data => {
            this.reloadPost();
            md.showNotification('top','center','rose','block','El posts ha sido eliminado',500);
          });
  }

  findComments( idPost, tituloPost ){
      this.afterEdit = false;
      this.idPost = idPost;
      this.watchPost = true;

      this._dbService.searchComments( idPost )
          .subscribe( data => {
            this.watchPost = true;
            this.postSelected = tituloPost;
            this.arrayPostComments = data.json();
            if( this.arrayPostComments.length == 0 )
              md.showNotification('top','center','danger','warning','El posts no contiene comment',500);
          });
  }

  editPost( idPost ){
    this.afterEdit = false;
    this.idPost = idPost;
    this.watchPost = true;
    this.postSelected = 'Edicion de post';

    this._dbService.loadUsers( )
          .subscribe( res => {
            this.arrayUsers = res;
          });
    
      this._dbService.findPost( idPost )
            .subscribe( data => {
              this.postData = data.json();
              this.postDataTitle = this.postData.title;
              this.postDataBody = this.postData.body;            
              this.postData = this.postData.userId;
            });
  }

  previous(){
    this.afterEdit = true;
    this.watchPost = false;
  }

  //edicion de posts
  edicionPost( postId ){

    if( this.sending ){
      md.showNotification('top','center','danger','warning','Su operacion esta en proceso',200);
    }
    else{
      this.sending = true;
    
    let postEdit = {
        userId: Number($("#userId").val()),
        title: this.postEdit["title"],
        body: this.postEdit["body"]
      }
    
    this._dbService.editarPost( postEdit, postId )
              .subscribe( data=>{
                if( data.ok ){
                  this.afterEdit = true;
                  this.reloadPost();
                  md.showNotification('top','center','primary','check','El posts ha sido editado!',500);
                }
                else{
                   md.showNotification('top','center','rose','block','El posts no se pudo editar',500);
                }
                this.sending = false;
      });

    }

  }

  //registro de un nuevo posts
  newPost(){
    
    if( this.sending ){
      md.showNotification('top','center','danger','warning','Su operacion esta en proceso',200);
    }
    else{
      this.sending = true;

      let post = {
        userId: Number(this.post["userId"]),
        title: this.post["title"],
        body: this.post["body"]
      }
     
      this._dbService.registrarPost( post )
              .subscribe( data=>{
                if( data.ok ){
                  this.postForm.reset();
                  this.reloadPost();
                  md.showNotification('top','center','primary','check','El posts ha sido creado!',500);
                }
                else{
                   md.showNotification('top','center','rose','block','El posts no se pudo crear',500);
                }
                this.previous();
      });  
    }
    
  }

  onRegisterFormValuesChanged()
    {
        for ( const field in this.postFormErrors )
        {
            if ( !this.postFormErrors.hasOwnProperty(field) )
            {
                continue;
            }

            this.postFormErrors[field] = {};

            const control = this.postForm.get(field);

            if ( control && control.dirty && !control.valid )
            {
                this.postFormErrors[field] = control.errors;
            }
        }
    }


    onRegisterFormValuesChangedEdit()
    {
        for ( const field in this.postFormEditErrors )
        {
            if ( !this.postFormEditErrors.hasOwnProperty(field) )
            {
                continue;
            }

            this.postFormEditErrors[field] = {};

            const control = this.postFormEdit.get(field);

            if ( control && control.dirty && !control.valid )
            {
                this.postFormEditErrors[field] = control.errors;
            }
        }
    }
    


  

}