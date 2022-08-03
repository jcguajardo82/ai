import { Component, OnInit } from '@angular/core';
import { Usuario } from '../_models/usuario'
import { Rol } from '../_models/rol'
import { UserService } from '../_services/user.service';
import { RolService } from '../_services/rol.service';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';

class Status {
  label: string;
  val: string;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  styles: [`
  :host ::ng-deep .p-dialog .product-image {
      width: 150px;
      margin: 0 auto 2rem auto;
      display: block;
  }
`],
})


export class UsersComponent implements OnInit {


  
  userDialog: boolean;

  users: Usuario[];

  user: Usuario;

  submitted: boolean;

  selectedUsers: Usuario[];

  roles : Rol[];
  selectedRolId : string;

  status : Status[];
  selectedSatus :string="false";


  constructor(private userService: UserService,private rolService:RolService
    ,private messageService: MessageService, private confirmationService: ConfirmationService) { 

      this.status = [
        {label: 'Activo', val: 'true'},
        {label: 'Inactivo', val: 'false'},     
    ];

    }

  ngOnInit(): void {
    this.userService.getAll() .subscribe(
      data => {
        this.users = data.result;
       /*  console.log(data.result);
        console.log(data.message); */
      },
      error => {
        console.log(error);
        this.messageService.add({severity:'error', summary: 'Error', detail: error, life: 3000});
      });

      this.getRoles();
  }

  hideDialog() {
    this.userDialog = false;
    this.submitted = false;
  }

  edit(user: Usuario) {
    this.user = {...user};
    this.selectedRolId =this.user.rol.toString();
    if(this.user.activo)
    {
      this.selectedSatus="true";
    }
    this.userDialog = true;
  }

  openNew() {

      this.user = {
        idUsuario: 0,
        nombre: null,
        activo: true,
        fechaCreacion: null,
        autor: null,
        modificadoPor: null,
        fechaModificacion:null,
        usuario:null ,
        rol: 0
      };

      this.submitted = false;
      this.userDialog = true;
  }

  save() {
    this.submitted = true;

    if (this.user.nombre.trim()) {
      this.user.activo=this.selectedSatus.toLowerCase() == 'true';
      this.user.rol=parseInt(this.selectedRolId);
        if (this.user.idUsuario!=0) {
                  //llamado al function de actualizar    

              this.userService.Update(this.user)
              .subscribe(
                response => {
                  console.log(response);
                  //console.log("Actualizo");
                  this.refreshList();
                  this.messageService.add({severity:'success', summary: 'Successful', detail: 'Usuario Actualizado', life: 3000});
                },
                error => {
                  console.log(error);
                });

            
        }
        else {
            //llamado al function de alta
            this.userService.Add(this.user)
            .subscribe(
              response => {
                //console.log("agrego");
                //console.log(response);
                this.refreshList();
                this.submitted = true;
                this.messageService.add({severity:'success', summary: 'Successful', detail: 'Usuario Creado', life: 3000});
              },
              error => {
                //console.log(error);
                this.messageService.add({severity:'error', summary: 'Error', detail: error, life: 3000});
              });

            
        }

     
        this.userDialog = false;
        
    }
  }

  refreshList(): void {
    this.ngOnInit();
    
  }

  getRoles():void{
    this.rolService.getAll() .subscribe(
      data => {
        if(data.isSuccess){
        this.roles = data.result;}
        else{
          this.messageService.add({severity:'error', summary: 'Error', detail: data.message, life: 3000});
        }
       /*  console.log(data.result);
        console.log(data.message); */
      },
      error => {
        console.log(error);
        this.messageService.add({severity:'error', summary: 'Error', detail: error, life: 3000});
      });

  }
}
