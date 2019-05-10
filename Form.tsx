import * as React from 'react';
import styles from './Form.module.scss';
import { IFormProps } from './IFormProps';
import { TextField, MaskedTextField } from 'office-ui-fabric-react/lib/TextField';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { CommandBar } from 'office-ui-fabric-react/lib';
import { Pivot, PivotItem, PivotLinkSize } from 'office-ui-fabric-react/lib';
import {
    ComboBox,
    IComboBoxOption,
} from 'office-ui-fabric-react/lib/index';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib';
import DetailListGroupItem from '../../models/IDetailListGroupItem';
import * as constants from '../../constants';
import * as utils from '../../utils';

import { Label } from 'office-ui-fabric-react/lib/Label';
import { Button, ActionButton } from 'office-ui-fabric-react/lib';
import Services from '../../services/Services';
import { loadTheme } from 'office-ui-fabric-react/lib';

export default class Form extends React.Component<IFormProps, {
    loading: boolean;
    hideDialog: boolean;
    item: DetailListGroupItem;
    isSaving: boolean;
    hideMessage: boolean;
    messageText?: string;
    messageType: MessageBarType;


    
}> {

    
    private KeyWordOptions: IComboBoxOption[] = [];
    private TermGroupOptions: IComboBoxOption[] = []; 
    constructor(props: IFormProps) {
        super(props);
     
        this._showDialog = this._showDialog.bind(this);
        this._closeDialog = this._closeDialog.bind(this);

        this.state = {
            loading: false,
            hideDialog: false,
            item: this.props.item !== undefined ? this.props.item : {
               ID: 0,
              
               Term_Group:"",
               Keyword:"",
               Value:""
               
            },
            isSaving: false,
            messageText: "",
            hideMessage: true,
            messageType: MessageBarType.success,
        };

        this.handleKeyWordChange = this.handleKeyWordChange.bind(this);

        //NOT MOCK
        let terms = this.props.terms;
        let generalTerms = terms.filter(x=>x.Name === "General")[0];
        generalTerms.Terms = JSON.parse(generalTerms.StrTermSets);

        let pageTerms = terms.filter(x=>x.Name === "TermGroups")[0];

        if(pageTerms !== undefined)
        {
            pageTerms.Terms = JSON.parse(pageTerms.StrTermSets);

            let docGroup = pageTerms.Terms.filter(_=>_.Name === "Term_Group")[0];
            docGroup.Terms.forEach((_)=>{
                this.TermGroupOptions.push({ key: _.DefaultLabel, text: _.DefaultLabel });
            });
            let KeyWord = pageTerms.Terms.filter(_=>_.Name === "Keyword")[0];
            KeyWord.Terms.forEach((_)=>{
                this.KeyWordOptions.push({ key: _.DefaultLabel, text: _.DefaultLabel });
            });
           
           
        }

        //MOCK
        // this.relevancyOptions.push({ key: "Client Relevant", text: "Client Relevant" });
        // this.relevancyOptions.push({ key: "Client Not Relevant", text: "Client Not Relevant" });

        // this.KeyWordOptions.push({ key: "File", text: "File" });
        // this.KeyWordOptions.push({ key: "File 2", text: "File 2" });

    }

    public render(): React.ReactElement<IFormProps> {
        let data;
        data = <Pivot linkSize={PivotLinkSize.normal}>
            <PivotItem
                headerText="General Information"
                headerButtonProps={{
                    'data-order': 1,
                    'data-title': 'General Information'
                }}>
                <br />
                <div className={styles.row}></div>
                <div className={styles.row}>
                    <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg3">
                        <ComboBox
                            label="Term Group"
                            placeholder="Select or type an option"
                            allowFreeform
                            required={true}
                            autoComplete="on"
                            options={this.TermGroupOptions}
                            selectedKey={this.state.item.Term_Group}
                            onChanged={this.handleTermGroupChange.bind(this,  this.state.item.Term_Group)}
                        />
                    </div>
                    <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg3">
                        <ComboBox
                            disabled={true}
                            label="Keyword"
                            placeholder="Select or type an option"
                            allowFreeform
                            required={true}
                            autoComplete="on"
                            options={this.KeyWordOptions}
                            selectedKey={this.state.item.Keyword}
                            onChanged={this.handleKeyWordChange.bind(this,  this.state.item.Keyword)}
                        />
                    </div>

                    <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg3">
                        <TextField label="Value" value={ this.state.item.Value } required={true} onBeforeChange={(val) =>  this._updateObj(val, "Value")} />
                    </div>
                </div>
                <br />
                <div className={styles.row}></div>
                <div className={styles.row}></div>
                 
            </PivotItem>
        </Pivot>;

        return (
            <div className={styles.ohdinsurance}>
                <div className={styles.container}>
                    <div>
                        <CommandBar
                            items={this.getItems()}
                            farItems={this.getFarItems()}
                        />
                        {!this.state.hideMessage ?
                            (<MessageBar messageBarType={this.state.messageType} onDismiss={() => { this.setState({ hideMessage: true }); }} dismissButtonAriaLabel="Close">
                                {this.state.messageText}
                            </MessageBar>) : ('')
                        }

                    </div>
                    <div className={styles.row}>
                        <div className={styles.column}>
                            <span className={styles.title}>DetailListGroupItem</span>
                        </div>
                    </div>

                    <div className={styles.row}>
                        {data}
                    </div>
                    <br />
                    {this.state.isSaving ?
                        (<div className='ms-textAlignCenter'>
                            <div className="ms-BasicSpinnersExample">
                                <Spinner size={SpinnerSize.medium} label="Saving data." ariaLive="assertive" />
                            </div>
                        </div>) : ('')
                    }
                </div>
            </div>
        );
    }

    private _showDialog = (): void => {
        this.setState({ hideDialog: true });
    }

    private _closeDialog = (): void => {
        this.props.onDismiss();
    }

    private _saveForm = (): void => {

       
        //Validating fields

        if (this.state.item.Value === undefined || this.state.item.Value === null || this.state.item.Value === "") {
            this.setState({ messageType: MessageBarType.error, messageText: "The Value is required.", hideMessage: false });
            return;
        }

       /*  if (this.state.item.Document_Note === undefined || this.state.item.Document_Note === null || this.state.item.Document_Note === "") {
            this.setState({ messageType: MessageBarType.error, messageText: "The document note is required.", hideMessage: false });
            return;
        } */
        this.setState({ isSaving: true, hideMessage: true });

        var service = new Services();
        service.setAPIURL(this.props.apiURL);
        service.save(this.state.item).then((item) =>{

            var messageTypeResult: MessageBarType = MessageBarType.success;
            var messageTextResult: string = "The data was saved sucessfully.";

            if (item === null) {
                messageTypeResult = MessageBarType.error;
                messageTextResult = "An error has ocurred saving the data, please try again.";
            }

            this.setState({ item: item, isSaving: false, hideMessage: false, messageType: messageTypeResult, messageText: messageTextResult });
        });
    }

    private _updateObj = (value: string, property: string): void => {
        var obj = this.state.item;
        switch (property) {

        
        
            case "Term_Group":
                obj.Term_Group = value;
                break;
            case "Keyword":
                obj.Keyword = value;
                break;
         
        
            case "Value":
                obj.Value = value;
                break;          
            
        }
        this.setState({ item: obj });
    }


    private handleKeyWordChange = (event: React.FormEvent<HTMLDivElement>, item: any): void => {
        var obj = this.state.item;
        obj.Keyword = item.text;
        
    }
    private handleTermGroupChange = (event: React.FormEvent<HTMLDivElement>, item: any): void => {
        
        var obj = this.state.item;
        obj.Term_Group = item.text;

       this.setState({item: obj});
      
    }
    
    // Data for CommandBar
    private getItems = () => {
        return [
            {
                key: 'save',
                name: 'Save',
                iconProps: {
                    iconName: 'Save'
                },
                disabled: this.state.isSaving,
                onClick: () => this._saveForm()
            },
            {
                key: 'folder',
                name: 'Open Folder',
                disabled:  this.state.item.ID === 0,
                iconProps: {
                    iconName: 'FabricFolderSearch'
                },
                onClick: () => {
                    //TODO: Implement
                    // if (this.state.item !== null && this.state.item !== undefined && this.state.item !== "")
                    //     window.open(this.state.item.LinkToDocument, '_blank');
                }
            }
        ];
    }

    private getFarItems = () => {
        return [
            {
                key: 'help',
                name: 'Help',
                iconProps: {
                    iconName: 'Help'
                },
                onClick: () => console.log('Help')
            },
            {
                key: 'close',
                name: 'Close',
                iconProps: {
                    iconName: 'Cancel'
                },
                onClick: () => this._closeDialog()
            }
        ];
    }



}
