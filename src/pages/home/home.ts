import { Component } from '@angular/core';
import { NavController, AlertController, ActionSheetController } from 'ionic-angular';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database'
import { Observable } from 'rxjs';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  shoppingList: AngularFireList<any>;
  itens: Observable<any[]>;
  name: string;
  number: number = 0;

  constructor(public navCtrl: NavController, afDatabase: AngularFireDatabase,
    public alertCtrl: AlertController, public actionSheetCtrl: ActionSheetController) {
      this.shoppingList = afDatabase.list('/shopping-list');
      this.itens = this.shoppingList.valueChanges();
  }

  addItem2(Name, Number){
    console.log(Name,Number)

    const newItemRef = this.shoppingList.push({});

    newItemRef.set({
      id: newItemRef.key,
      itemName: Name,
      itemNumber: Number
    });

    this.name = '';
    this.number = 0;
  }

  addItem(){
    let prompt = this.alertCtrl.create({
      title: 'Item',
      message: "Entre com os dados do seu item !",
      inputs: [
        {
          name: 'Nome',
          placeholder: 'Nome'
        },
        {
          name: 'Quantidade',
          placeholder: 'Quantidade'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
            console.log('Cancelar selecionado');
          }
        },
        {
          text: 'Salvar',
          handler: data => {
            const newItemRef = this.shoppingList.push({});

            newItemRef.set({
              id: newItemRef.key,
              itemName: data.Nome,
              itemNumber: data.Quantidade
            });
          }
        }
      ]
    });
    prompt.present();
  }

  showOptions(itemId, itemName, itemNumber) {
    console.log();

    let actionSheet = this.actionSheetCtrl.create({
      title: 'O que voce quer fazer?',
      buttons: [
        {
          text: 'Excluir',
          role: 'destructive',
          handler: () => {
            this.removeItem(itemId);
          }
        },{
          text: 'Atualizar',
          handler: () => {
            this.updateItem(itemId, itemName, itemNumber);
          }
        },{
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancelar selecionado');
          }
        }
      ]
    });
    actionSheet.present();
  }

  removeItem(itemId: string){
    this.shoppingList.remove(itemId);
  }

  updateItem(itemId, itemName, itemNumber){
    let prompt = this.alertCtrl.create({
      title: 'Item',
      message: "Atualize os dados do seu item !",
      inputs: [
        {
          name: 'Nome',
          placeholder: 'Nome',
          value: itemName
        },
        {
          name: 'Quantidade',
          placeholder: 'Quantidade',
          value: itemNumber
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
            console.log('Cancelar selecionado');
          }
        },
        {
          text: 'Salvar',
          handler: data => {
            this.shoppingList.update(itemId, {
              itemName: data.Nome,
              itemNumber: data.Quantidade
            });
          }
        }
      ]
    });
    prompt.present();
  }
}
