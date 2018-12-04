import { Injectable  } from '@angular/core';
import { map } from 'rxjs/operators';
import { Headers, Http } from '@angular/http';


@Injectable()
export class DbService {

  urlPostLocal:any='http://localhost:3000/posts';
  urlUsersLocal:any='http://localhost:3000/users';
  urlCommentsLocal:any='http://localhost:3000/comments';


  constructor( public http:Http ) {
  }
  
  // Metodo para cargar lista de Posts
  public loadPost(){

    return this.http.get( this.urlPostLocal )
               .pipe(map( res => res.json()));

  }

  // Metodo para cargar lista de usuarios
  public loadUsers(){

    return this.http.get( this.urlUsersLocal )
               .pipe(map( res => res.json()));

  }
  
  // Metodo para cargar lista de comments
  public loadComments(){

    return this.http.get( this.urlCommentsLocal )
               .pipe(map( res => res.json()));

  }
  
  // Metodo para registrar usuarios
  public registrarUsuario( usuario:any ){
    let body = JSON.stringify( usuario );
    let headers = new Headers({
      'Content-Type':'application/json'
    });

    return this.http.post( this.urlUsersLocal, body, { headers })
          .pipe(map( res=>{
           return res;
    }));

  }
  

  // Metodo para buscar posts por id
  public findPost( postId ){
    return this.http.get(`http://localhost:3000/posts/${ postId }`);
  }
  
  // Metodo para buscar comments por id
  public findComment( commentId ){
    return this.http.get(`http://localhost:3000/comments/${ commentId }`);
  }
  
  // Metodo para eliminar un posts
  public deletePost( postId ){
    return this.http.delete(`http://localhost:3000/posts/${ postId }`);
  }
  
  // Metodo para buscar los comments de un posts
  public searchComments( postId ){
    return this.http.get(`http://localhost:3000/posts/${ postId }/comments`);
  }
  
  // Metodo para eliminar un comment
  public deleteComment( idComment ){
    return this.http.delete(`http://localhost:3000/comments/${ idComment }`);
  }

  // Metodo para buscar los posts por usuario
  public postByUser( userId ){

    return this.http.get(`http://localhost:3000/posts?userId=${ userId }`);
    
  }
  
  // Metodo para registrar posts
  public registrarPost( post:any ){
    let body = JSON.stringify( post );
    let headers = new Headers({
      'Content-Type':'application/json'
    });

    return this.http.post( this.urlPostLocal, body, { headers })
          .pipe(map( res=>{
           return res;
    }));

  }
  
  // Metodo para registrar comments
  public registrarComment( comment:any ){
    let body = JSON.stringify( comment );
    let headers = new Headers({
      'Content-Type':'application/json'
    });

    return this.http.post( this.urlCommentsLocal, body, { headers })
          .pipe(map( res=>{
           return res;
    }));
  }

  // Metodo para editar posts
  public editarPost( postEdit, idPost ){

  let body = JSON.stringify( postEdit, idPost );
  let headers = new Headers({
    'Content-Type':'application/json'
  });

  let url = `${ this.urlPostLocal }/${ idPost }`;

  return this.http.put( url, body, { headers })
                  .pipe(map( res=>{
                    return res;
    }));
  }

  // Metodo para editar comments
  public editarComment( commentEdit, idComment ){

  let body = JSON.stringify( commentEdit, idComment );
  let headers = new Headers({
    'Content-Type':'application/json'
  });

  let url = `${ this.urlCommentsLocal }/${ idComment }`;

  return this.http.put( url, body, { headers })
                  .pipe(map( res=>{
                    return res;
    }));
  }


}
