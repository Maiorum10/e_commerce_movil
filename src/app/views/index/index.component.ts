import { Component, OnInit } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { Router } from '@angular/router';
import { ServicioService } from "src/app/servicios/servicio.service";
import Swal from 'sweetalert2';
import { ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { validador_txtarea, sa_modal } from '../../../assets/javascript/scripts';

@Component({
  selector: "app-index",
  templateUrl: "./index.component.html",
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  @ViewChild('myModalClose') mymodalClose;
  @ViewChild('ModalClose') modalClose;
  @ViewChild('aModalClose') amodalClose;
  @ViewChild('bModalClose') bmodalClose;
  @ViewChild('cModalClose') cmodalClose;
  @ViewChild('dModalClose') dmodalClose;
  @ViewChild('eModalClose') emodalClose;
  @ViewChild('eModalOpen') emodalOpen;
  navbarOpen = false;
  myArray:any='';
  productos:any=[];
  imagenes:any;
  imagenes_detalle:any;
  paginas = 5;
  desde:any = 0;
  hasta:any = 5;
  numero:any
  rowList=[];
  titulo:any;
  titulo1:any='Productos'
  usuario:any;
  nombre:any='';
  apellido:any='';
  cedula:any='';
  clave:any='';
  log_clave:any='';
  log_cedula:any='';
  sucursales:any;
  nombre_sucursal:any;
  id_sucursal:any;
  direccion:any;
  ciudad:any;
  talla:any='Seleccione una talla'
  buscador:any;
  precio_f:any;
  talla_f:any;
  stock_f:any;
  stock:any=0;
  subtotal:any;
  total:any=0;
  dias:any=1;
  id_producto:any;
  fecha:any;
  ultimo:any
  cantidad:any
  subtotal2:any
  id_producto2:any
  total_stock:any=0
  base_stock:any=0
  reservas:any;
  imagen:any;
  img:any;
  cuenta:any;
  fotos:any;
  detalle:any;
  descripcion:any;
  codigo:any
  visitas:any=0
  cat:any='disfraces'
  id_producto_talla:any;
  talla2:any
  id_conjunto:any;
  id_conjunto2:any;
  estrellas:any=0;
  detalles:any;
  textarea:any='';
  id_usuario:any;
  contador:any;
  contador2:any;
  total_contador:any;
  telefono:any;
  dir:any;

  constructor(private servicio: ServicioService,
    private router: Router, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.consultar_comentarios()
    this.promedio()
    this.consultar_imagenes_carrusel();
    this.fechajs();
    document.getElementById('btn1').style.display = 'none';
    this.consultar_sucursales();
    this.consultar_visitantes();

    if(localStorage.getItem('cedula')!=null){
      this.usuario=localStorage.getItem('nombre')+' '+localStorage.getItem('apellido')
      this.nombre=localStorage.getItem('nombre')
      this.apellido=localStorage.getItem('apellido')
      this.cedula=localStorage.getItem('cedula')
      this.dir=localStorage.getItem('direccion')
      this.telefono=localStorage.getItem('telefono')
      this.clave=localStorage.getItem('clave')
      this.id_usuario=localStorage.getItem('id_usuario')
      document.getElementById('btn').style.display = 'none';
      document.getElementById('btn1').style.display = 'block';
    }
  }

  validador_txt(){
    if(validador_txtarea()==false){

    }else{
      if(localStorage.getItem('nombre')==null||localStorage.getItem('nombre')==''){
        Swal.fire('Inicie sesión','','warning')
      }else{
        this.emodalOpen.nativeElement.click();
      }
    }
  }

  fechajs(){
    let dia;
    let mes;
    const currentDate = new Date();

    const currentDayOfMonth = currentDate.getDate();
    const currentMonth = currentDate.getMonth()+1; // Be careful! January is 0, not 1
    const currentYear = currentDate.getFullYear();
    if(currentDayOfMonth<=9){
      dia='0'+currentDayOfMonth
    }else{
      dia=currentDayOfMonth
    }
    if(currentMonth<=9){
      mes='0'+currentMonth
    }else{
      mes=currentMonth
    }

    this.fecha = currentYear + "-" + mes + "-" + dia;
  }

  setNavbarOpen() {
    this.navbarOpen = !this.navbarOpen;
  }

  cambiarPagina(e:PageEvent){
    this.desde = e.pageIndex * e.pageSize;
    this.hasta = this.desde + e.pageSize;
  }

  promedio(){
    let body={
      'accion': 'consulta_calificacion'
    }
    return new Promise(resolve=>{
      this.servicio.postData(body).subscribe((res:any)=>{
        if(res.estado){
          let promedio=res.datos[0].avg;
          promedio=promedio*1
          console.log(promedio)
          if(promedio<0.5){
            this.estrellas=0
          }else if(promedio>=0.5&&promedio<1.5){
            this.estrellas='1'
          }else if(promedio>=1.5&&promedio<2.5){
            this.estrellas='2'
          }else if(promedio>=2.5&&promedio<3.5){
            this.estrellas='3'
          }else if(promedio>=3.5&&promedio<4.5){
            this.estrellas='4'
          }else if(promedio>=4.5){
            this.estrellas='5'
          }
          console.log(this.estrellas)
        }else{

        }
      });
    });
  }

  logout(){
    localStorage.clear();
    Swal.fire('Cerró su sesión','','info')
    document.getElementById('btn1').style.display = 'none';
    document.getElementById('btn').style.display = 'block';
    this.nombre=''
    this.apellido=''
    this.cedula=''
    this.ciudad=''
    this.reservas=[]
  }

  consultar_productos(){
    this.talla='Seleccione una talla'
    this.buscador=''
    this.cat='Disfraces'
    let body={
      'accion': 'consultar_cantidad_productos',
      'id_sucursal': this.id_sucursal
    }
    return new Promise(resolve=>{
      this.servicio.postData(body).subscribe((res:any)=>{
        if(res.estado){
          this.numero=res.datos[0].contar;
          let body={
            'accion': 'consultar_productos',
            'id_sucursal': this.id_sucursal
          }
          return new Promise(resolve=>{
            this.servicio.postData(body).subscribe((res:any)=>{
              if(res.estado){
                this.productos=res.datos;
              }else{
                this.productos=[]
              }
            },(err)=>{

            });
          });
        }else{
          Swal.fire('No hay productos','','warning');
        }
      },(err)=>{
        Swal.fire('','Error de conexión','error');
        console.log(err)
      });
    });
  }

  deleteNew(element:string) {
    this.myArray.forEach((value,index)=>{
        if(value.nombre==element) this.myArray.splice(index,1);
    });
    console.log(this.myArray);
  }

  borrar(producto){
    let n = producto.nombre
    this.deleteNew(n)
    this.contar();
  }

  contar(){
    this.total=0
    for(let a=0; a<this.myArray.length; a++){
      let b=0
      b=b*1+this.myArray[a].subtotal
      this.total=this.total*1+b*1
    }
    this.total=(this.total*1)*(this.dias*1)
  }

  addNew(){
    if(this.myArray==''){
      this.myArray=[]
      if(this.stock_f==0||this.stock_f=='0'){
        Swal.fire('No se puede agregar al carrito con el stock en 0','','warning')
      }else if(this.stock==0||this.stock=='0'){
        Swal.fire('No se puede agregar al carrito con el stock en 0','','warning')
      }else{
        this.subtotal=(this.stock*1)*(this.precio_f*1)
        this.myArray.push({id_producto: this.id_producto, id_conjunto: this.id_conjunto, stock: this.stock, nombre: this.titulo, precio_dia: this.precio_f, talla: this.talla_f, subtotal: this.subtotal, contador: this.contador})
        console.log(this.myArray)
        this.bmodalClose.nativeElement.click();
        Swal.fire('Agregado con éxito','','success')
      }
    }else{
      this.myArray.forEach((value,index)=>{
        if(value.nombre==this.titulo && value.talla==this.talla_f) this.myArray.splice(index,1);
      });
      if(this.stock_f==0||this.stock_f=='0'){
        Swal.fire('No se puede agregar al carrito con el stock en 0','','warning')
      }else if(this.stock==0||this.stock=='0'){
        Swal.fire('No se puede agregar al carrito con el stock en 0','','warning')
      }else{
        this.subtotal=(this.stock*1)*(this.precio_f*1)
        this.myArray.push({id_producto: this.id_producto, id_conjunto: this.id_conjunto, stock: this.stock, nombre: this.titulo, precio_dia: this.precio_f, talla: this.talla_f, subtotal: this.subtotal, contador: this.contador})
        console.log(this.myArray)
        this.bmodalClose.nativeElement.click();
        Swal.fire('Agregado con éxito','','success')
      }
    }
  }

  consultar_visitantes(){
    let body={
      'accion': 'consultar_visitantes'
    }
    return new Promise(resolve=>{
      this.servicio.postData(body).subscribe((res:any)=>{
        if(res.estado){
          let visitas=res.datos;
          this.visitas=visitas[0].contador
          this.visitas=this.visitas*1+1
          this.actualizar_contador()
        }else{
          this.visitas=0
        }
      },(err)=>{

      });
    });
  }

  consultar_imagenes(producto){
    this.stock=0
    this.id_producto_talla = producto.id_producto
    let body={
      'accion': 'consultar_fotos',
      'id_producto': this.id_producto_talla
    }
    return new Promise(resolve=>{
      this.servicio.postData(body).subscribe((res:any)=>{
        if(res.estado){
          this.imagenes=res.datos;
          this.id_producto=this.imagenes[0].id_producto
          this.titulo=this.imagenes[0].nombre
          this.precio_f=this.imagenes[0].precio_dia
          this.talla_f=this.imagenes[0].talla
          this.stock_f=this.imagenes[0].stock
          this.detalle=this.imagenes[0].detalle
          this.descripcion=this.imagenes[0].descripcion
          this.codigo=this.imagenes[0].total
          this.id_conjunto=this.imagenes[0].id_conjunto
          this.contador=this.imagenes[0].contador
          this.contador=this.contador*1+1
          this.consultar_imagenes_detalle(producto);
        }else{

        }
      },(err)=>{

      });
    });
  }

  consultar_imagenes_detalle(producto){
    this.id_producto_talla = producto.id_producto
    let body={
      'accion': 'consultar_fotos_detalle',
      'id_producto': this.id_producto_talla
    }
    return new Promise(resolve=>{
      this.servicio.postData(body).subscribe((res:any)=>{
        if(res.estado){
          this.imagenes_detalle=res.datos;
        }else{

        }
      },(err)=>{

      });
    });
  }

  click_talla(talla){
    this.stock=0
    let body={
      'accion': 'consultar_tallas_id_productos',
      'talla': talla,
      'id_producto': this.id_producto_talla
    }
    return new Promise(resolve=>{
      this.servicio.postData(body).subscribe((res:any)=>{
        if(res.estado){
          let tallas=res.datos;
          this.stock_f=tallas[0].stock
          this.precio_f=tallas[0].precio_dia
          this.talla_f=tallas[0].talla
          this.id_conjunto=tallas[0].id_conjunto
        }else{

        }
      },(err)=>{

      });
    });
  }

  consultar_imagenes_carrusel(){
    let body={
      'accion': 'consultar_fotos_carrusel'
    }
    return new Promise(resolve=>{
      this.servicio.postData(body).subscribe((res:any)=>{
        if(res.estado){
          this.fotos=res.datos;
        }else{

        }
      },(err)=>{

      });
    });
  }

  actualizar_contador(){
    let body={
      'accion': 'actualizar_visitantes',
      'contador': this.visitas
    }
    return new Promise(resolve=>{
      this.servicio.postData(body).subscribe((res:any)=>{
        if(res.estado){

        }else{

        }
      });
    });
  }

  recuperacion(){
    if(this.nombre==''||this.apellido==''||this.cedula==''){
      Swal.fire('Campos vacíos','','warning')
    }else{
      let body={
        'accion': 'actualizar_contrasena',
        'nombre': this.nombre,
        'apellido': this.apellido,
        'cedula': this.cedula,
        'clave': this.clave
      }
      return new Promise(resolve=>{
        this.servicio.postData(body).subscribe((res:any)=>{
          if(res.estado){
            let usuario=res.datos;
            Swal.fire('Clave actualizada','','success')
            this.cmodalClose.nativeElement.click();
            this.nombre=''
            this.apellido=''
            this.cedula=''
            this.clave=''
          }else{
            Swal.fire('Datos incorrectos','','warning')
          }
        },(err)=>{
          Swal.fire('Datos incorrectos','','error')
        });
      });
    }
  }

  validacion(){
    if(this.stock>this.stock_f){
      Swal.fire('No pude ingresar un valor mayor al stock actual','','warning')
      this.stock=0
    }
  }

  crear_reserva(){
    if(localStorage.getItem('nombre')==null||localStorage.getItem('nombre')==''){
      Swal.fire('Inicie sesión','','warning')
    }else if(this.myArray==''){
      Swal.fire('Agregue productos al carrito','','warning')
    }else{
      let body={
        'accion': 'crear_reserva',
        'dias': this.dias,
        'fecha': this.fecha,
        'total': this.total,
        'usuarios_id_usuario': localStorage.getItem('id_usuario'),
        'estado': 'pendiente'
      }
      return new Promise(resolve=>{
        this.servicio.postData(body).subscribe((res:any)=>{
          if(res.estado){
            let body={
              'accion': 'consulta_ultima_reserva'
            }
            return new Promise(resolve=>{
              this.servicio.postData(body).subscribe((res:any)=>{
                if(res.estado){
                  let reserva=res.datos;
                  this.ultimo=reserva[0].id_reserva
                  let o
                  o=this.myArray.length
                  for(let i=0; i< o; i++){
                    this.cantidad=this.myArray[i].stock
                    this.id_producto2=this.myArray[i].id_producto
                    this.subtotal2=this.myArray[i].subtotal
                    this.talla2=this.myArray[i].talla
                    this.id_conjunto2=this.myArray[i].id_conjunto
                    let body={
                      'accion': 'crear_detalle_reserva',
                      'cantidad': this.cantidad,
                      'reservas_id_reserva': this.ultimo,
                      'conjuntos_id_conjunto':this.id_conjunto2,
                      'sub_total':this.subtotal2
                    }
                    this.servicio.postData(body).subscribe()
                    let body2={
                      'accion': 'consulta_stock',
                      'id_conjunto': this.id_conjunto2,
                      'talla': this.talla2
                    }
                    this.servicio.postData(body2).subscribe((res:any)=>{
                      this.id_producto2=this.myArray[i].id_producto
                      this.id_conjunto2=this.myArray[i].id_conjunto
                      this.talla2=this.myArray[i].talla
                      this.cantidad=this.myArray[i].stock
                      this.contador2=this.myArray[i].contador
                      let stocks= res.datos
                      this.base_stock= stocks[0].stock
                      this.total_stock=0
                      this.total_stock=this.base_stock*1-this.cantidad*1
                      this.total_contador=this.contador2*1+this.cantidad*1
                      console.log(this.total_stock+'---'+this.base_stock+'---'+this.cantidad+'-id-'+this.id_conjunto2)
                      let body3={
                        'accion': 'actualizar_stock',
                        'stock': this.total_stock,
                        'id_conjunto': this.id_conjunto2,
                        'talla': this.talla2,
                        'contador': this.contador2
                      }
                      this.servicio.postData(body3).subscribe((res:any)=>{
                      if(res.estado){
                        this.consultar_sucursales();
                        Swal.fire('Pedido realizado con exito','','success')
                        this.total_stock=0
                        this.base_stock=0
                        this.cantidad=0
                        this.id_producto2=0
                        this.ultimo=0
                        this.total=0
                        this.myArray.pop()
                      }else{
                      }
                      },(err)=>{
                      });

                    })
                  }

                }else{
                }
              },(err)=>{

              });
            });
          }else{

          }
        },(err)=>{

        });
      });
    }

  }

  llenar_detalle(){
    let body={
      'accion': 'crear_detalle_reserva',
      'cantidad': this.cantidad,
      'reservas_id_reserva': this.ultimo,
      'productos_id_producto':this.id_producto2,
      'sub_total':this.subtotal2
    }
    return new Promise(resolve=>{
      this.servicio.postData(body).subscribe((res:any)=>{
        if(res.estado){
        }else{
          console.log('1')
        }
      },(err)=>{
        console.log('2')
      });
    });
  }

  consultar_stock(){
    let body={
      'accion': 'consulta_stock',
      'id_producto': this.id_producto2
    }
    return new Promise(resolve=>{
      this.servicio.postData(body).subscribe((res:any)=>{
        if(res.estado){
          let stocks= res.datos
          let base_stock= stocks[0].stock
          this.total_stock=base_stock*1-this.cantidad*1
          console.log(this.id_producto2)
          let body={
            'accion': 'actualizar_stock',
            'stock': this.total_stock,
            'id_producto': this.id_producto2
          }
          return new Promise(resolve=>{
            this.servicio.postData(body).subscribe((res:any)=>{
              if(res.estado){
                this.consultar_sucursales();
              }else{
              }
            },(err)=>{
            });
          });
        }else{
        }
      },(err)=>{
      });
    });

  }

  registro_usuarios(){
    if(this.nombre==''){
      Swal.fire('Ingrese el nombre','','warning')
    }else if(this.apellido==''){
      Swal.fire('Ingrese el apellido','','warning')
    }else if(this.cedula==''){
      Swal.fire('Ingrese la cedula','','warning')
    }else if(this.clave==''){
      Swal.fire('Ingrese la clave','','warning')
    }else if(this.telefono==''){
      Swal.fire('Ingrese la telefono','','warning')
    }else if(this.dir==''){
      Swal.fire('Ingrese la dir','','warning')
    }else{
      let body={
        'accion': 'consultar_usuario_cedula',
        'cedula': this.cedula
      }
      return new Promise(resolve=>{
        this.servicio.postData(body).subscribe((res:any)=>{
          if(res.estado){
            let usuarios=res.datos;
            this.nombre=''
            this.apellido=''
            this.cedula=''
            this.clave=''
            Swal.fire('Usuario ya registrado','','warning')
          }else{
            let body={
              'accion': 'registro_usuarios',
              'nombre': this.nombre,
              'apellido': this.apellido,
              'cedula': this.cedula,
              'clave': this.clave,
              'telefono': this.telefono,
              'direccion': this.dir
            }
            return new Promise(resolve=>{
              this.servicio.postData(body).subscribe((res:any)=>{
                if(res.estado){
                  let usuario=res.datos;
                  Swal.fire('Registrado con éxito','','success')
                  this.nombre=''
                  this.apellido=''
                  this.cedula=''
                  this.clave=''
                  this.telefono=''
                  this.dir=''
                  this.mymodalClose.nativeElement.click();
                }else{
                  Swal.fire('Datos incorrectos','','warning')
                }
              },(err)=>{

              });
            });
          }
        },(err)=>{
          console.log(err)
        });
      });
    }
  }

  login(){
    if(this.log_cedula==''){
      Swal.fire('Ingrese la cedula','','warning')
    }else if(this.log_clave==''){
      Swal.fire('Ingrese la clave','','warning')
    }else{
      let body={
        'accion': 'login_usuarios',
        'cedula': this.log_cedula,
        'clave': this.log_clave
      }
      return new Promise(resolve=>{
        this.servicio.postData(body).subscribe((res:any)=>{
          if(res.estado){
            let usuario=res.datos;
            localStorage.setItem('id_usuario', usuario[0].id_usuario)
            localStorage.setItem('cedula', usuario[0].cedula)
            localStorage.setItem('nombre', usuario[0].nombre)
            localStorage.setItem('apellido', usuario[0].apellido)
            localStorage.setItem('direccion', usuario[0].direccion)
            localStorage.setItem('telefono', usuario[0].telefono)
            this.nombre=usuario[0].nombre
            this.apellido=usuario[0].apellido
            this.cedula=usuario[0].cedula
            this.clave=usuario[0].clave
            this.dir=usuario[0].direccion
            this.telefono=usuario[0].telefono
            this.usuario=localStorage.getItem('nombre')+' '+localStorage.getItem('apellido')
            document.getElementById('btn').style.display = 'none';
            document.getElementById('btn1').style.display = 'block';
            this.modalClose.nativeElement.click();
            Swal.fire('Bienvenido',this.usuario,'success')
          }else{
            Swal.fire('Datos incorrectos','','warning')
          }
        },(err)=>{
          console.log(err)
        });
      });
    }
  }

  actualizar_usuario(){
    let body={
      'accion': 'actualizar_usuarios',
      'nombre': this.nombre,
      'apellido': this.apellido,
      'cedula': this.cedula,
      'clave': this.clave,
      'direccion': this.dir,
      'telefono': this.telefono
    }
    return new Promise(resolve=>{
      this.servicio.postData(body).subscribe((res:any)=>{
        if(res.estado){
          let usuario=res.datos;
          localStorage.setItem('nombre', this.nombre)
          localStorage.setItem('apellido', this.apellido)
          this.usuario=this.nombre+' '+this.apellido
          Swal.fire('Actualizado con éxito','','success')
          this.amodalClose.nativeElement.click();
        }else{
          Swal.fire('Datos incorrectos','','warning')
        }
      },(err)=>{

      });
    });
  }

  consultar_sucursales(){
    let body={
      'accion': 'consultar_sucursales'
    }
    return new Promise(resolve=>{
      this.servicio.postData(body).subscribe((res:any)=>{
        if(res.estado){
          this.sucursales=res.datos;
          this.id_sucursal=this.sucursales[0].id_sucursal;
          this.nombre_sucursal=this.sucursales[0].nombre_sucursal;
          this.direccion=this.sucursales[0].direccion;
          this.ciudad=this.sucursales[0].ciudad;
          this.cuenta=this.sucursales[0].cuenta;
          this.consultar_productos();
        }else{

        }
      },(err)=>{

      });
    });
  }

  click_sucursales(sucursal){
    this.talla='Seleccione una talla'
    this.id_sucursal=sucursal.id_sucursal
    this.nombre_sucursal=sucursal.nombre_sucursal
    this.ciudad=sucursal.ciudad
    this.cedula=sucursal.cedula
    this.cuenta=sucursal.cuenta
    this.consultar_productos();
  }

  click_categorias(cat){
    this.cat=cat
    let body={
      'accion': 'consultar_cantidad_productos_categoria',
      'id_sucursal': this.id_sucursal,
      'categoria': this.cat
    }
    return new Promise(resolve=>{
      this.servicio.postData(body).subscribe((res:any)=>{
        if(res.estado){
          this.numero=res.datos[0].contar;
          let body={
            'accion': 'consultar_productos_categoria',
            'id_sucursal': this.id_sucursal,
            'categoria': this.cat
          }
          return new Promise(resolve=>{
            this.servicio.postData(body).subscribe((res:any)=>{
              if(res.estado){
                this.productos=res.datos;
              }else{
                this.productos=[]
              }
            },(err)=>{

            });
          });
        }else{
          Swal.fire('No hay productos','','warning');
        }
      },(err)=>{
        Swal.fire('','Error de conexión','error');
        console.log(err)
      });
    });
  }

  click_tallas(talla){
    this.talla=talla
    let body={
      'accion': 'consultar_cantidad_productos_talla',
      'id_sucursal': this.id_sucursal,
      'talla': this.talla
    }
    return new Promise(resolve=>{
      this.servicio.postData(body).subscribe((res:any)=>{
        if(res.estado){
          this.numero=res.datos[0].contar;
          let body={
            'accion': 'consultar_productos_talla',
            'id_sucursal': this.id_sucursal,
            'talla': this.talla
          }
          return new Promise(resolve=>{
            this.servicio.postData(body).subscribe((res:any)=>{
              if(res.estado){
                this.productos=res.datos;
              }else{
                this.productos=[]
              }
            },(err)=>{

            });
          });
        }else{
          Swal.fire('No hay productos','','warning');
        }
      },(err)=>{
        Swal.fire('','Error de conexión','error');
        console.log(err)
      });
    });
  }

  consultar_reservas(){
    let body={
      'accion': 'consultar_reservas',
      'id_usuario': localStorage.getItem('id_usuario')
    }
    return new Promise(resolve=>{
      this.servicio.postData(body).subscribe((res:any)=>{
        if(res.estado){
          this.reservas=res.datos;
        }else{
          this.dmodalClose.nativeElement.click();
          Swal.fire('No hay reservas','','warning');
        }
      },(err)=>{
        Swal.fire('','Error de conexión','error');
        console.log(err)
      });
    });
  }

  get(event: any){
    this.imagen = event.target.files[0]
    this.img = event.target.files[0]
    this.servicio.guardarImagen(this.img).subscribe()
    Swal.fire('Subido satisfactoriamente','','success')
  }

  actualizar_imagen(reserva){
    let body={
      'accion': 'actualizar_imagen',
      'id_reserva': reserva.id_reserva,
      'imagen': this.imagen.name
    }
    return new Promise(resolve=>{
      this.servicio.postData(body).subscribe((res:any)=>{
        if(res.estado){
          let imagen=res.datos;
          this.dmodalClose.nativeElement.click();
        }else{
          Swal.fire('Error al subir la imágen','','warning');
        }
      },(err)=>{
        Swal.fire('','Error de conexión','error');
        console.log(err)
      });
    });
  }

  buscador_enter(){
    if(this.talla!='Seleccione una talla'){
      let body={
        'accion': 'consultar_cantidad_productos_buscador1',
        'id_sucursal': this.id_sucursal,
        'talla': this.talla,
        'nombre': '%'+this.buscador+'%'
      }
      return new Promise(resolve=>{
        this.servicio.postData(body).subscribe((res:any)=>{
          if(res.estado){
            this.numero=res.datos[0].contar;
            let body={
              'accion': 'consultar_productos_buscador1',
              'id_sucursal': this.id_sucursal,
              'talla': this.talla,
              'nombre': '%'+this.buscador+'%'
            }
            return new Promise(resolve=>{
              this.servicio.postData(body).subscribe((res:any)=>{
                if(res.estado){
                  this.productos=res.datos;
                }else{
                  this.productos=[]
                }
              },(err)=>{

              });
            });
          }else{
            Swal.fire('No hay productos','','warning');
          }
        },(err)=>{
          Swal.fire('','Error de conexión','error');
          console.log(err)
        });
      });
    }else{
      let body={
        'accion': 'consultar_cantidad_productos_buscador2',
        'id_sucursal': this.id_sucursal,
        'nombre': '%'+this.buscador+'%'
      }
      return new Promise(resolve=>{
        this.servicio.postData(body).subscribe((res:any)=>{
          if(res.estado){
            this.numero=res.datos[0].contar;
            let body={
              'accion': 'consultar_productos_buscador2',
              'id_sucursal': this.id_sucursal,
              'nombre': '%'+this.buscador+'%'
            }
            return new Promise(resolve=>{
              this.servicio.postData(body).subscribe((res:any)=>{
                if(res.estado){
                  this.productos=res.datos;
                }else{
                  this.productos=[]
                }
              },(err)=>{

              });
            });
          }else{
            Swal.fire('No hay productos','','warning');
          }
        },(err)=>{
          Swal.fire('','Error de conexión','error');
          console.log(err)
        });
      });
    }
  }

  public validador;
    validadorDeCedula(cedula: String) {
      if(this.cedula=='0000000000'||this.cedula=='2222222222'||this.cedula=='4444444444'||this.cedula=='5555555555'){
        Swal.fire('Cédula inválida','','warning')
        this.cedula=''
      }else{
        let cedulaCorrecta = false;
        if (cedula.length == 10)
        {
          let tercerDigito = parseInt(cedula.substring(2, 3));
          if (tercerDigito < 6) {
              // El ultimo digito se lo considera dígito verificador
              let coefValCedula = [2, 1, 2, 1, 2, 1, 2, 1, 2];
              let verificador = parseInt(cedula.substring(9, 10));
              let suma:number = 0;
              let digito:number = 0;
              for (let i = 0; i < (cedula.length - 1); i++) {
                  digito = parseInt(cedula.substring(i, i + 1)) * coefValCedula[i];
                  suma += ((parseInt((digito % 10)+'') + (parseInt((digito / 10)+''))));
            //      console.log(suma+" suma"+coefValCedula[i]);
              }
              suma= Math.round(suma);
            //  console.log(verificador);
            //  console.log(suma);
            //  console.log(digito);
              if ((Math.round(suma % 10) == 0) && (Math.round(suma % 10)== verificador)) {
                  cedulaCorrecta = true;
              } else if ((10 - (Math.round(suma % 10))) == verificador) {
                  cedulaCorrecta = true;
              } else {
                  cedulaCorrecta = false;
                  Swal.fire('Cédula inválida','','warning')
                  this.cedula=''
              }
            } else {
              cedulaCorrecta = false;
              Swal.fire('Cédula inválida','','warning')
              this.cedula=''
            }
        } else {
              cedulaCorrecta = false;
              Swal.fire('Cédula inválida','','warning')
              this.cedula=''
        }
        this.validador= cedulaCorrecta;
      }
    }

    consultar_comentarios(){
      let body={
        'accion': 'consultar_comentarios'
      }
      return new Promise(resolve=>{
        this.servicio.postData(body).subscribe((res:any)=>{
          if(res.estado){
            this.detalles=res.datos;
            console.log(this.detalles)
          }else{
            console.log('error')
          }
        },(err)=>{
          console.log(err)
        });
      });
    }

    guardar_comentarios(cal){
      let body={
        'accion': 'crear_calificacion',
        'calificacion': cal,
        'comentario': this.textarea,
        'usuarios_id_usuarios': localStorage.getItem('id_usuario')
      }
      console.log(body)
      return new Promise(resolve=>{
        this.servicio.postData(body).subscribe((res:any)=>{
          if(res.estado){
            let comentarios=res.datos;
            Swal.fire('Seleccionó '+cal+' estrellas','Comentario guardado','success')
            this.textarea=''
            this.emodalClose.nativeElement.click();
            this.promedio()
            this.consultar_comentarios();
          }else{
            console.log('error')
          }
        },(err)=>{
          console.log(err)
        });
      });
    }

}
