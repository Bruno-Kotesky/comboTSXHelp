import * as constants from "../constants";
import { ServiceKey, Guid } from "@microsoft/sp-core-library";
import IFilter from "../models/Filter";
import TermGroup from "../models/TermGroup";
import IProcedureRefDocsItem from "../models/IDetailListGroupItem";
export default class Services {

private apiURL:string = "";

public setAPIURL(apiURL:string) : void{
    this.apiURL = apiURL;
}

public getDetailInsurances(filter:IFilter): Promise<IProcedureRefDocsItem[]> {
    return new Promise<IProcedureRefDocsItem[]>((resolve, reject): void => {
        var result : IProcedureRefDocsItem[] = [];
        
        result.push({

          
            Term_Group:"GoiT",
          
            Value:"https://developer.microsoft.com/en-us/fabric#/styles/web/icons",
            Keyword:"TX",
            ID: 1
        });

        result.push({
          Term_Group:"GoiT",
          Value:"https://developer.microsoft.com/en-us/fabric#/styles/web/icons",
          Keyword:"TX",
            ID: 2
        });

        result.push({
            Term_Group:"MS",
            Keyword:"TX",
            Value:"https://developer.microsoft.com/en-us/fabric#/styles/web/icons",

            ID: 3
        });

        result.push({
          Term_Group:"MS",
          Value:"https://developer.microsoft.com/en-us/fabric#/styles/web/icons",
          Keyword:"WS",
          ID: 4
        });

        resolve(result);

    });
  }

public save(item:IProcedureRefDocsItem): Promise<IProcedureRefDocsItem> {
    return new Promise<IProcedureRefDocsItem>((resolve, reject): void => {
      
        if(item.ID === 0)
            item.ID = 10;

        //resolve(null);//Testar erro
        resolve(item);

    });
  }
  public getTermStoreFields(): Promise<TermGroup[]> {
    return new Promise<TermGroup[]>((resolve, reject): void => {

      //TOOD: Use real data
      var result:TermGroup[] = [
        {
          Id: Guid.parse("9428e410-0459-4fe7-b59b-f796993943f7"),
          Name: "General",
          StrTermSets: "[]",
          Terms: []
        },
        {
          Id: Guid.parse("9f307dec-2ccd-48d5-92d0-2ab8d9dc0d13"),
          Name: "TermGroups",
          StrTermSets: JSON.stringify([
          
            {
              GroupId: Guid.newGuid(),
              GroupName: "Term_Group",
              Id: Guid.newGuid(),
              Name: "Term_Group",
              Terms: [
                {
                  DefaultLabel: "GoiT",
                  Id: Guid.newGuid(),
                  Labels: []
                },
                {
                  DefaultLabel: "MS",
                  Id: Guid.newGuid(),
                  Labels: []
                }
              ]
            },
            {
              GroupId: Guid.newGuid(),
              GroupName: "Keyword",
              Id: Guid.newGuid(),
              Name: "Keyword",
              Terms: [
                {
                  DefaultLabel: "TX",
                  Id: Guid.newGuid(),
                  Labels: []
                },
                {
                  DefaultLabel: "WS",
                  Id: Guid.newGuid(),
                  Labels: []
                }
              ]
            }

          ]),
          Terms: []
        }
      ];
      
      resolve(result);


        
      });
    }
}
