import { Component, OnInit } from '@angular/core';
import { Menu } from '../_models/menu';
import { MenuService } from '../_services/menu.service';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';

class Status {
  label: string;
  val: string;
}

@Component({
  selector: 'app-menus',
  templateUrl: './menus.component.html',
  styleUrls: ['./menus.component.scss']
})


export class MenusComponent implements OnInit {



  userDialog: boolean;

  submitted: boolean;

  menus: Menu[];

  subMenus: Menu[];

  menu: Menu;

  selectedMenuId: string;

  selectedMenu: Menu;

  status: Status[];
  selectedSatus: string = "false";


  constructor(private menuService: MenuService
    , private messageService: MessageService, private confirmationService: ConfirmationService) {
    this.status = [
      { label: 'Activo', val: 'true' },
      { label: 'Inactivo', val: 'false' },
    ];

  }

  ngOnInit(): void {
    this.menuService.getMenusPadre().subscribe(
      data => {
        if (data.isSuccess) {
          this.menus = data.result;
        }
        else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: data.message, life: 3000 });
        }

      },
      error => {
        console.log(error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error, life: 3000 });
      });

  }

  editSub(menu: Menu) {
    this.menu = { ...menu };

    if (this.menu.habilitado) {
      this.selectedSatus = "true";
    }
    this.userDialog = true;
  }

  hideDialog() {
    this.userDialog = false;
    this.submitted = false;
  }

  openNew() {

    this.menu = {
      menuId: "0",
      descripcion: null,
      descripcionCorta: null,
      padreId: "0",
      posicion: null,
      icono: null,
      habilitado: null,
      url: null,
      esMenu: null,
      target: null,
      controller: null,
      action: null
    };

    this.submitted = false;
    this.userDialog = true;
  }

  newSub() {

    this.menu = {
      menuId: "0",
      descripcion: null,
      descripcionCorta: null,
      padreId: this.selectedMenuId,
      posicion: null,
      icono: null,
      habilitado: null,
      url: null,
      esMenu: null,
      target: null,
      controller: null,
      action: null
    };

    this.submitted = false;
    this.userDialog = true;
  }


  openEdit() {
    if (this.selectedMenuId != null) {


      this.getMenuById(this.selectedMenuId);
      this.submitted = false;
      this.userDialog = true;
    }
  }

  openDelete() {
    if (this.selectedMenuId != null) {
      this.confirmationService.confirm({
        message: '¿Está seguro que desea eliminar el menu ?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
  
          this.menuService.delMenu(this.selectedMenuId).subscribe(
            data => {
              if (data.isSuccess) {
                this.loadSubMenus(this.selectedMenuId);
                this.refreshList();
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Menu Eliminado', life: 3000 });
              }
              else {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: data.message, life: 3000 });
              }
  
            },
            error => {
              console.log(error);
              this.messageService.add({ severity: 'error', summary: 'Error', detail: error, life: 3000 });
            });
        }
      });

    }
  }

  refreshList(): void {
    this.ngOnInit();

  }



  save() {
    this.submitted = true;

    if (this.menu.descripcion.trim()) {
      this.menu.habilitado = this.selectedSatus.toLowerCase();

      if (this.menu.menuId != "0") {
        //llamado al function de actualizar    

        this.menuService.Update(this.menu)
          .subscribe(
            response => {
              //console.log(response);
              //console.log("Actualizo");
              this.refreshList();
              this.loadSubMenus(this.selectedMenuId)
              this.submitted = true;
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Usuario Actualizado', life: 3000 });
            },
            error => {
              console.log(error);
            });


      }
      else {
        //llamado al function de alta
        this.menuService.Add(this.menu)
          .subscribe(
            response => {
              //console.log("agrego");
              //console.log(response);
              this.refreshList();
              this.loadSubMenus(this.selectedMenuId)
              this.submitted = true;
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Usuario Creado', life: 3000 });
            },
            error => {
              //console.log(error);
              this.messageService.add({ severity: 'error', summary: 'Error', detail: error, life: 3000 });
            });


      }


      this.userDialog = false;

    }
  }

  onChangeMenu(event) {
    /*   let changedValue = event.value;
     this.selectedMenuName=changedValue; */
    this.loadSubMenus(event.value);
  }

  loadSubMenus(padreId) {
    this.subMenus = null;
    this.menuService.getMenusHijos(padreId).subscribe(
      data => {
        if (data.isSuccess) {
          this.subMenus = data.result;
        }
        else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: data.message, life: 3000 });
        }

      },
      error => {
        console.log(error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error, life: 3000 });
      });

  }

  getMenuById(idMenu) {
    this.menuService.getMenu(idMenu).subscribe(
      data => {
        if (data.isSuccess) {
          this.menu = { ...data.result };
        }
        else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: data.message, life: 3000 });
        }

      },
      error => {
        console.log(error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error, life: 3000 });
      });

  }

  deleteSub(menu: Menu) {
    console.log("entra a eliminar");

    this.confirmationService.confirm({
      message: '¿Está seguro que desea eliminar el menu ' + menu.descripcion + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        this.menuService.delMenuSub(menu.menuId).subscribe(
          data => {
            if (data.isSuccess) {
              this.loadSubMenus(this.selectedMenuId);
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Menu Eliminado', life: 3000 });
            }
            else {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: data.message, life: 3000 });
            }

          },
          error => {
            console.log(error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error, life: 3000 });
          });
      }
    });

  }
}
