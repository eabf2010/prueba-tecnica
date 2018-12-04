import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgForm } from '@angular/forms'
import { ActivatedRoute } from "@angular/router";
import { DbService } from '../../services/db.service';

declare const $:any;
declare const jQuery:any;
declare const md:any;


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit{
  
  userForm: FormGroup;
  userFormErrors: any;
  arrayUsers:any = [];
  arrayPostsUsers:any = [];
  sending:boolean = false;
  watchPost:boolean = false;
  userSelected:string = null;
  afterCheck:boolean = true;
  watchUsers:boolean = false;

  public user:any = {
    name:"",
    phone:"",
    email:null,
    city:null
  }

  constructor( private route:ActivatedRoute,
               private _dbService: DbService,
               private formBuilder: FormBuilder) { 

    this.userFormErrors = {
            name         : {},
            phone       : {},
            email          : {},
            city          : {}
    };

  }
 
  ngOnInit() {
        
        //Aqui se llena la lista de usuario al iniciar la vista
        this._dbService.loadUsers( )
          .subscribe( data => {
            this.arrayUsers = data;
            if( this.arrayUsers.length == 0 )
              //lugar, alinacion, tipo, icono, mensaje, duracion
              md.showNotification('top','center','danger','warning','Parece que no hay usuarios registrados!',500);
          });

        //validador de los inputs del formulario
        this.userForm = this.formBuilder.group({
            name         : ['', Validators.required],
            phone       : ['', [Validators.required, Validators.maxLength(30)]],
            email          : ['', [Validators.required, Validators.email]],
            city       : ['', Validators.required],
        });

        this.userForm.valueChanges.subscribe(() => {
            this.onRegisterFormValuesChanged();
        });
  }

  //funcion para buscar los posts de un usuario
  postUser( filtro ){
    this.watchUsers = true;
    this.afterCheck = false;
    let userId = filtro;
    this.watchPost = true;
    
    for ( let array in this.arrayUsers ) {
          if( userId == this.arrayUsers[array].id )
            this.userSelected = this.arrayUsers[array].name;        
    }
    

    //aqui invoco al servicio para buscar los post de un usuario
    this._dbService.postByUser( userId )
    .subscribe( data=>{
      if( data.ok ){
        if( data.json().length > 0 )
          this.arrayPostsUsers = data.json();
        else
          md.showNotification('top','center','danger','warning','El usuario no ha realizado posts aun!',500); 
      }
      else
        md.showNotification('top','center','rose','block','Ha ocurrido un error',500);
    })

  }

  //funcion usada para recargar la lista de usuarios
  reloadUsers(){
    this.sending = false;
    this._dbService.loadUsers( )
          .subscribe( data => {
            this.arrayUsers = data;
          });
  }

  //funcion para volver a la lista de usuarios
  previous(){
    this.afterCheck = true;
    this.watchUsers = false;
  }

  //funcion para crear un nuevo usuario
  newUser(){
    
    //variable que permite invocar el servicio una sola vez 
    //hasta que este devuelva una respuesta
    if( this.sending ){
      md.showNotification('top','center','danger','warning','Su operacion esta en proceso',200);
    }
    else{
      this.sending = true;
      
      this._dbService.registrarUsuario( this.user )
              .subscribe( data=>{
                if( data.ok ){
                  this.userForm.reset();
                  this.reloadUsers();
                  md.showNotification('top','center','primary','check','Usuario registrado',500);
                }
                else{
                   md.showNotification('top','center','rose','block','El usuario no pudo ser registrado',500);
                }
                this.previous();

      });  
    }
    
  }
  
  //esto permite validar los cambios en cada input del form
  onRegisterFormValuesChanged()
    {
        for ( const field in this.userFormErrors )
        {
            if ( !this.userFormErrors.hasOwnProperty(field) )
            {
                continue;
            }

            this.userFormErrors[field] = {};

            const control = this.userForm.get(field);

            if ( control && control.dirty && !control.valid )
            {
                this.userFormErrors[field] = control.errors;
            }
        }
    }

}
