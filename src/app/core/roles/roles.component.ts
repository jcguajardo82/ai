import { Component, OnInit } from '@angular/core';
import { Rol, } from '../_models/rol'
import { SetMenuRol } from '../_models/set-menu-rol'
import { RolService } from '../_services/rol.service';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import {TreeNode} from 'primeng/api';


class Status {
  label: string;
  val: string;
}

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
 
  files2: TreeNode[];
  selectedFiles: TreeNode[]= [];
  dataArray: string[] = [];

  userDialog: boolean;
  submitted: boolean;

  roles : Rol[];
  selectedRolId : string;
  rol : Rol;
  setMenuRol :SetMenuRol;
  status: Status[];
  selectedSatus: string = "false";

  constructor(private rolService:RolService 
    ,private messageService: MessageService, private confirmationService: ConfirmationService) { 
      this.status = [
        { label: 'Activo', val: 'true' },
        { label: 'Inactivo', val: 'false' },
      ];
    }


  ngOnInit(): void {
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

  hideDialog() {
    this.userDialog = false;
    this.submitted = false;
  }
  onChangeRol(event) {
    /*   let changedValue = event.value;
     this.selectedMenuName=changedValue; */
    this.loadMenus(event.value);
  }

  openNew() {

    this.rol = {
      idRol: 0,
      descripcion: null,
      nombreRol:null,
      activo:true

    };
    this.selectedSatus='true';
    this.submitted = false;
    this.userDialog = true;
  }

  openEdit() {
    if (this.selectedRolId != null) {


      this.rolService.getRol(this.selectedRolId).subscribe(
        data => {
          if (data.isSuccess) {
            this.rol = { ...data.result };
            if(this.rol.activo)
            {this.selectedSatus='true';}

          }
          else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: data.message, life: 3000 });
          }
  
        },
        error => {
          console.log(error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error, life: 3000 });
        });
  

 
      this.submitted = false;
      this.userDialog = true;
    }
  }


  expandAll(){
    this.files2.forEach( node => {
        this.expandRecursive(node, true);
    } );
  }

  collapseAll(){
    this.files2.forEach( node => {
        this.expandRecursive(node, false);
    } );
  }

  private expandRecursive(node:TreeNode, isExpand:boolean){
    node.expanded = isExpand;
    if (node.children){
        node.children.forEach( childNode => {
            this.expandRecursive(childNode, isExpand);
        } );
    }
  }

  loadMenus(menuId){
    this.files2=null;
  this.rolService.getMenuRol(menuId) .subscribe(
    data => {
      if(data.isSuccess){
      this.files2 = data.result;
        this.checkMenus();
        this.expandAll();
       }
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

  checkMenus()
  {
    this.selectedFiles =[];
    for(let i=0 ; i < this.files2.length ; i++){
      if(this.files2[i].data=="1"){
        this.selectedFiles.push(this.files2[i]);            
      }
      if(this.files2[i].children)
      {
          for(let a=0 ; a < this.files2[i].children.length ; a++){
          
            if(this.files2[i].children[a].data=="1"){
              this.selectedFiles.push(this.files2[i].children[a]);
            }
          }
        
      }   

    }

    
  }

  nodeSelect(event) {
   /*  this.messageService.add({
      severity: 'info',
      summary: 'Node Selected',
      detail: event.node.key,
    }); */
    this.setMenuRol={
      activo:true,
      idMenu:event.node.key,
      idRol:Number.parseInt(this.selectedRolId)
    }
   
    this.addMenuRol(this.setMenuRol);

    if(event.node.children!=null)
    {
    
      event.node.children.forEach( childNode => {
        this.setMenuRol={
          activo:true,
          idMenu:childNode.key,
          idRol:Number.parseInt(this.selectedRolId)
        }
        this.addMenuRol(this.setMenuRol);
      } );
     
    }

    if(event.node.parent!=null)
    {
      if(event.node.parent.partialSelected){
        this.setMenuRol={
          activo:true,
          idMenu:event.node.parent.key,
          idRol:Number.parseInt(this.selectedRolId)
        }
    
        this.addMenuRol(this.setMenuRol);
      }
    }
    
  }

  nodeUnselect(event) {
    /* this.messageService.add({
      severity: 'info',
      summary: 'Node Unselected',
      detail: event.node.key,
    }); */
    this.setMenuRol={
      activo:false,
      idMenu:event.node.key,
      idRol:Number.parseInt(this.selectedRolId)
    }

    this.addMenuRol(this.setMenuRol);


    if(event.node.parent==null)
    {   
      event.node.children.forEach( childNode => {
        this.setMenuRol={
          activo:false,
          idMenu:childNode.key,
          idRol:Number.parseInt(this.selectedRolId)
        }
        this.addMenuRol(this.setMenuRol);
      } );    
    }else{
      if(!event.node.parent.partialSelected){
        this.setMenuRol={
          activo:false,
          idMenu:event.node.parent.key,
          idRol:Number.parseInt(this.selectedRolId)
        }
    
        this.addMenuRol(this.setMenuRol);
      }
    }

  }

  addMenuRol(m:SetMenuRol){
    this.rolService.setMenuRol(m) .subscribe(
      data => {
        if(data.isSuccess){
  
          this.messageService.add({severity:'success', summary: 'Successful', detail: 'Movimiento realizado con éxito', life: 3000});
        }
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

  save() {
    this.submitted = true;

    if (this.rol.nombreRol.trim()) {
      this.rol.activo = this.selectedSatus.toLowerCase() == 'true';

      if (this.rol.idRol != 0) {
        //llamado al function de actualizar    

        this.rolService.updRol(this.rol)
          .subscribe(
            response => {

              this.ngOnInit();       
              this.submitted = true;
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Rol Actualizado', life: 3000 });
            },
            error => {
              console.log(error);
            });


      }
      else {
        //llamado al function de alta
        this.rolService.addRol(this.rol)
          .subscribe(
            response => {
              this.ngOnInit(); 
              this.submitted = true;
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Rol Creado', life: 3000 });
            },
            error => {
              //console.log(error);
              this.messageService.add({ severity: 'error', summary: 'Error', detail: error, life: 3000 });
            });


      }


      this.userDialog = false;

    }
  }

}
