import { WebPartContext } from "@microsoft/sp-webpart-base";
import * as pnp from "sp-pnp-js";
import { CamlQuery } from "sp-pnp-js";

interface ListDetails {
  listName: string;
  fields?: string[];
  expandFields?: string[];
  itemId?: number;
  filter?: string;
  orderedColumn?: string;
  top?: number;
  isRoot?: boolean;
}


export default class SharepointServiceProxy {
  static getItems(arg0: { listName: string; fields: string[]; }) {
    throw new Error("Method not implemented.");
  }
  static getCurrentUser() {
    throw new Error("Method not implemented.");
  }
  private web;
  private site: any;
  private relativeSiteUrl;
  currentUser: any;
  constructor(_context: WebPartContext, webUrl: string) {
    this.web = new pnp.Web(webUrl);
    this.site = new pnp.Web(webUrl.slice(0, webUrl.lastIndexOf('/')))
    this.relativeSiteUrl = webUrl.split(".com")[1];
  }

  /**
* Get all listitems of a list
* @param listName Name of SharePoint list
*/
  getItems({ listName, orderedColumn, isRoot }: ListDetails, order?: boolean, isPaged?: boolean): Promise<any[]>;
  /**
   * Get listitems of a list with specific fields
   * @param listName Name of SharePoint list
   * @param fields Fields whose values are fetched
   */
  getItems(
    { listName, fields, orderedColumn, isRoot }: ListDetails, order?: boolean,
    isPaged?: boolean
  ): Promise<any[]>;
  /**
   * Get listitems of a list with specific fields, any of which is lookup
   * @param listName Name of SharePoint list
   * @param fields Fields whose values are fetched
   * @param expandFields Lookup fields
   */
  getItems(
    { listName, fields, expandFields, orderedColumn, isRoot }: ListDetails, order?: boolean,
    isPaged?: boolean
  ): Promise<any[]>;
  /**
   * Get listitems of a list with filter criteria
   * @param listName Name of SharePoint list
   * @param filter Filter criteria
   */
  getItems(
    { listName, filter, orderedColumn, isRoot }: ListDetails, order?: boolean,
    isPaged?: boolean
  ): Promise<any[]>;
  /**
   * Get listitems of a list with specific fields and filter criteria
   * @param listName Name of SharePoint list
   * @param fields Fields whose values are fetched
   * @param filter Filter criteria
   */
  getItems(
    { listName, fields, filter, orderedColumn, isRoot }: ListDetails, order?: boolean,
    isPaged?: boolean
  ): Promise<any[]>;
  getItems(
    { listName, fields, filter, orderedColumn, isRoot }: ListDetails, order?: boolean,
    isPaged?: boolean
  ): Promise<any[]>;
  getItems(
    { listName, fields, filter, top, orderedColumn, isRoot }: ListDetails, order?: boolean,
    isPaged?: boolean
  ): Promise<any[]>;
  async getItems(
    { listName, fields, expandFields, itemId, filter, top, orderedColumn, isRoot = false }: ListDetails, order?: boolean,
    isPaged: boolean = false
  ): Promise<any[]> {
    let listItems;
    if (isRoot) {
      listItems = this.site.lists.getByTitle(listName).items;
    } else {
      listItems = this.web.lists.getByTitle(listName).items;
    }

    if (fields) {
      listItems = listItems.select(...fields);
      // expandFields will only be present if fields are present
      if (expandFields) {
        listItems = listItems.expand(...expandFields);
      }
    }

    // Items are fetched by filter
    if (filter) {
      listItems = listItems.filter(filter);
    }

    if (orderedColumn) {
      listItems = listItems.orderBy(orderedColumn, order);
    }
    if (top) {
      listItems = listItems.top(top);
    }

    // TODO: use get() method with generic T, where T is model. Avoid <any>
    return listItems.get();
    // return fromPromise(
    //   ((): any => {
    //     if (isPaged) {
    //       return listItems
    //         .top(this.pageSize)
    //         .orderBy(this.pageOrderBy)
    //         .getPaged();
    //     } else {
    //       return listItems.get();
    //     }
    //   })()
    // ).catch(this.errorHandler(`Error in fetching data from: ${listName}`));
  }

  /**
   * Get listitems of a list with specific fields and filter criteria
   * @param listName Name of SharePoint list
   * @param fields Fields whose values are fetched
   * @param expandFields Lookup fields
   * @param filter Filter criteria
   * @param top to get top values
   * @param orderedColumn to get data in order by column
   */
  async getEmployeeData(
    { listName, fields, expandFields, filter, top, orderedColumn }: ListDetails, order?: boolean,
    isPaged: boolean = false
  ): Promise<any[]> {
    let listItems = this.site.lists.getByTitle(listName).items;

    if (fields) {
      listItems = listItems.select(...fields);
      // expandFields will only be present if fields are present
      if (expandFields) {
        listItems = listItems.expand(...expandFields);
      }
    }

    // Items are fetched by filter
    if (filter) {
      listItems = listItems.filter(filter);
    }

    if (orderedColumn) {
      listItems = listItems.orderBy(orderedColumn, order);
    }
    if (top) {
      listItems = listItems.top(top);
    }

    return listItems.get();

  }

  /**
   * Get listitem of a list by Id
   * @param listName Name of SharePoint list
   * @param itemId Item Id of listItem
   */
  async getItemById(listName: string, itemId: number): Promise<any> {
    return await this.web.lists.getByTitle(listName).items.getById(itemId).get();
  } // TODO: get only required fields, try to use T in pnp call

  /**
   * Add ListItem to List
   * @param listName Name of SharePoint List
   * @param values Data to add as ListItem
   */

  async addItem(listName: string, values: any, files: any[], isRoot: boolean = false): Promise<any> {
    let item;
    if (isRoot) {
      item = await this.site.lists.getByTitle(listName).items.add(values);
    } else {
      item = await this.web.lists.getByTitle(listName).items.add(values);
    }
    if (files.length > 0) {
      await item.item.attachmentFiles.addMultiple(files);
    }
    return item;
  }

  /**
   *
   * @param listName Name of SharePoint List
   * @param id Item Id of listItem
   * @param values Data to update the ListItem
   */
  async updateItem(listName: string, id: number, values: any, files: any[], isRoot: boolean = false): Promise<any> {
    if (isRoot) {
      return this.site.lists.getByTitle(listName).items.getById(id).update(values)
        .then(async (res: any) => {
          if (files.length > 0) {
            await res.item.attachmentFiles.addMultiple(files);
          }
        });
    } else {
      return this.web.lists.getByTitle(listName).items.getById(id).update(values)
        .then(async res => {
          if (files.length > 0) {
            await res.item.attachmentFiles.addMultiple(files);
          }
        });
    }

    // item.update(values);
    // if (files.length>0) {
    //   item.attachmentFiles.getByName("xyz").recycle();
    // }
    // return item;

  }

  async deleteItemAttachments(listName: string, id: number, files: any[], isRoot: boolean = false) {
    let item;
    if (isRoot) {
      item = await this.site.lists.getByTitle(listName).items.getById(id);
    } else {
      item = await this.web.lists.getByTitle(listName).items.getById(id);
    }
    for (let index = 0; index < files.length; index++) {
      await item.attachmentFiles.getByName(files[index].Name).delete();

    }
  }

  async addItemAttachments(listName: string, id: number, files: any[], isRoot: boolean = false) {
    let item;
    if (isRoot) {
      item = await this.site.lists.getByTitle(listName).items.getById(id);
    } else {
      item = await this.web.lists.getByTitle(listName).items.getById(id);
    }
    // var item = await this.web.lists.getByTitle(listName).items.getById(id);
    await item.attachmentFiles.addMultiple(files);
  }

  /**
   * Get details of List
   * @param listName Name of SharePoint List
   */
  getList(listName: string): Promise<any> {
    const list = this.web.lists.getByTitle(listName);
    return (list.get());
  }

  /**
   * Add file to the library and get its id and path after upload
   * @param libraryName Name of SharePoint Document Library
   * @param file File object to upload
   * @param overwrite Overwrite existing file or not
   */
  async addFile(libraryName: string, file: any, overwrite?: true, salesId?: number): Promise<any> {
    // https://github.com/SharePoint/PnP-JS-Core/wiki/Working-With:-Files
    // const files = this.web.getFolderByServerRelativeUrl(
    //   `${this.relativeSiteUrl}/Lists/${libraryName}/`
    // ).files;

    var files = await this.web.getFolderByServerRelativeUrl(
      `${this.relativeSiteUrl}/${libraryName}/`
    ).files.add(file.name, file, true);
    var item = await files.file.getItem();
    await item.update({
      SalesIDId: salesId,
    })
    return item;

    // return (files
    //   .add(file.name, file, true)
    //   .then((result) => result.file.getItem("Id"))
    // );
  }

  // async getCurrentUser(): Promise<any> {
  //   if (!this.currentUser) {
  //     var user = await this.web.currentUser.get();
  //     var userProperties = this.GetUserProperties();
  //     var userGroups = await this.web.siteUsers.getById(user.Id).groups.get();
  //     this.currentUser = {
  //       Groups: userGroups.filter((a: any) => { return a.Title.includes("EmployeeHub_HR") }),
  //       User: user,
  //       UserProperties: userProperties
  //     };
  //     return this.currentUser;
  //   } else {
  //     return this.currentUser;
  //   }
  // }
  async getCurrentUser(): Promise<any> {
    if (!this.currentUser) {

      var user = await this.web.currentUser.get();
      var userProperties = await this.GetUserProperties();
      var userGroups = await this.web.siteUsers.getById(user.Id).groups.get();
      this.currentUser = {
        Groups: userGroups.filter((a: any) => { return a.Title.includes("TS_") }),
        User: user,
        UserProperties: userProperties
      };
      return this.currentUser;

    }

    else {

      return this.currentUser;

    }
  }



  GetUserProperties(): void {

    pnp.sp.profiles.myProperties.get().then(function (result) {
      var userProperties = result.UserProfileProperties;

      var userPropertyValues: any[] = [];;
      userProperties.forEach(function (property: any) {

        userPropertyValues.push({ 'pName': property.Key, 'pValue': property.Value });

      });
      return userPropertyValues;
      // document.getElementById("spUserProfileProperties").innerHTML = userPropertyValues;

    }).catch(function (error) {
      console.log("Error: " + error);

    });

  }

  async getSiteUsers(): Promise<any> {
    return this.web.siteUsers.get();
  }

  async ensureUser(email: any): Promise<any> {
    return this.web.ensureUser(email);
  }

  /**
* Get listitems by CAML query
* @param listName Name of SharePoint List
* @param viewXml Xml for CAML query
*/
  getItemsByCAML(listName: string, viewXml: string) {
    const query: CamlQuery = { ViewXml: viewXml };
    return (
      this.web.lists.getByTitle(listName).getItemsByCAMLQuery(query)
    );
  }

  async getFileArrayBuffer(url: any) {
    return await fetch(url).then(res => {
      return res.arrayBuffer();
    });
    // return fromPromise(sp.web.getFileByServerRelativeUrl(url).getBlob().then(res=>{
    //   return res;
    // }));
  }

  async getFileBlob(url: any) {
    return this.web.getFileByServerRelativePath(url).getBlob();
    // async getFileBlob(url) {
    //   return await fetch(url).then(res => {
    //     return res.blob();
    //   });
    // return fromPromise(sp.web.getFileByServerRelativeUrl(url).getBlob().then(res=>{
    //   return res;
    // }));
  }

  async getChoices(listName: string, choiceField: string) {
    var choices: any;
    var fields = await this.web.lists.getByTitle(listName);
    var field = await fields.fields.getByInternalNameOrTitle(choiceField);
    await field.select("Choices,ID").get().then((_choices: any) => {
      choices = _choices.Choices;
    });
    return choices;
  }

  async getImages(listName: string, folderName: string): Promise<any> {
    // var folder = await this.web.getFolderByServerRelativeUrl(listName).folders;
    var allFolders = await this.web.rootFolder.folders.getByName(listName).folders.getByName(folderName).getItem();
    return allFolders;
  }

  getPagedData(
    listName: string,
    pageSize: number,
    orderedColumn: string = "ID"
  ) {
    return (
      this.web.lists
        .getByTitle(listName)
        .items.top(pageSize)
        .orderBy(orderedColumn)
        .getPaged()
    );
  }


}