import { Combobox } from '@twilio-paste/core/combobox';
import React, { useEffect } from 'react';
import { useToaster, Toaster } from '@twilio-paste/core/toast';
import axios from 'axios';
import { Input } from '@twilio-paste/core/input';
import { Heading } from '@twilio-paste/core/heading';
import { Button } from '@twilio-paste/core/button';
import { Table, THead, Tr, Td, Th, TBody, TFoot } from '@twilio-paste/core/table';
import { TimePicker } from '@twilio-paste/core/time-picker';
import { Checkbox, HelpText, Label } from '@twilio-paste/core';
import { DatePicker, formatReturnDate } from '@twilio-paste/core/date-picker';
import { Modal, ModalBody, ModalFooter, ModalFooterActions, ModalHeader, ModalHeading } from '@twilio-paste/core/modal';
import { encode as base64_encode } from 'base-64';
import { useUID } from '@twilio-paste/core/uid-library';
import ReactFileReader from 'react-file-reader';
import { DeleteIcon } from "@twilio-paste/icons/esm/DeleteIcon";

let newData = []

export const SiteCampaigns = () => {
    const [campaign, setCampaign] = React.useState(newData);
    const [siteCampaign, setSiteCampaign] = React.useState(newData);
    const [retries, setRetries] = React.useState();
    const [retriesWeek, setRetriesWeek] = React.useState();
    const [interval, setInterval] = React.useState();
    const [duration, setDuration] = React.useState();
    const [callerId, setCallerId] = React.useState();
    const [enabled, setEnabled] = React.useState();
    const [dnd, setDND] = React.useState();
    const [tz, setTZ] = React.useState("Asia/Singapore");
    const [start, setStart] = React.useState('');
    const [end, setEnd] = React.useState('');
    const [updateCampaign, setUpdateCampaign] = React.useState([]);
    const [showTimes, setShowTimes] = React.useState(false);
    const [selectedCampaign, setSelectedCampaign] = React.useState(false);
    const [dynamoCampaigns, setDynamoCampaigns] = React.useState("");
    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false)
    const [isModalOpen, setModalOpen] = React.useState(false);
    const toaster = useToaster();
    const [fileData, setFileData] = React.useState("");
    const [showResults, setShowResults] = React.useState(false)
    const [isOpen, setIsOpen] = React.useState(false);

    const removeNumber = (number, name) => {
        console.log(`****** Remove Number`, number, name)
        let listContact = []
        for (let i = 0; i < updateCampaign.length; i++) {
            if (updateCampaign[i].phoneNumber === number) {

            } else {
                listContact.push(updateCampaign[i])
                //listPrompts.push(dynamoPrompts[i].prompts[j])
            }
            setUpdateCampaign(listContact)
            let deleteData = JSON.stringify({
                "TableName": `${siteCampaign}-Campaign`,
                "Key": {
                    "phoneNumber": {
                        "S": number
                    }
                }
            });
    
            let deleteConfig = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `${process.env.REACT_APP_URL}/deleteSettings`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: deleteData
            };
            axios.request(deleteConfig)
                .then((response) => {
                    console.log(JSON.stringify(response.data));
                })
                .catch((error) => {
                    console.log(error);
                });
        }
}

const loadCampaign = (campaignName) => {
    let currentCampaigns = [];
    let readData = JSON.stringify({
        "TableName": `${campaignName}-Campaign`
    });
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${process.env.REACT_APP_URL}/readSettings`,
        headers: {},
        data: readData
    };
    console.log(config)
    axios.request(config)
        .then((response) => {
            let items = response.data.items
            console.log("I", items)
            setUpdateCampaign(items)
        })
        .catch((error) => {
            console.log(error);
        });



}

const AddCampaignModal = (prop) => {
    const uidDP = useUID();
    const uidHT = useUID();
    let location = prop.location
    const handleOpen = () => {
        setIsOpen(true)
        console.log("Modal Open");
    }
    const handleClose = () => {
        setIsOpen(false)
        console.log("Modal closed")
    };

    const handleFiles = (files) => {
        let importFileData = files.base64[0].replace("data:text/csv;base64,", "");
        setFileData(importFileData); // Save file data to state
        setIsOpen(false);
        console.log(importFileData)
        let csvUploadData = JSON.stringify({
            "data": importFileData
          });
          
          let csvUploadConfig = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://lj3qlnw0qh.execute-api.ap-southeast-1.amazonaws.com/connect-outbound/csvUpload',
            headers: { 
              'Content-Type': 'application/json'
            },
            data : csvUploadData
          };
          
          axios.request(csvUploadConfig)
          .then((response) => {
            console.log(response)
            toaster.push({
                message: 'File Uploaded',
                variant: 'success',
                dismissAfter: 3000
            })
            loadCampaign(siteCampaign)
          })
          .catch((error) => {
            console.log(error);
          });
    };
    const modalHeadingID = useUID();
    const nameInputRef = React.createRef();
    const dateInputRef = React.createRef();
    const [date, setDate] = React.useState('');
    const [name, setName] = React.useState('');
    return (
        <div>
            <Button variant="primary" onClick={handleOpen}>
                New Contact List
            </Button>
            <Modal ariaLabelledby={modalHeadingID} isOpen={isOpen} onDismiss={handleClose} size="default">
                <ModalHeader>
                    <ModalHeading as="h3" id={modalHeadingID}>
                        New Contact List
                    </ModalHeading>
                </ModalHeader>
                <ModalBody>
                    <div
                        style={{ width: "90%", margin: "auto" }}>
                        <div style={{ display: "flex", gap: "300px" }}>
                            <span>
                                <Label>Select a CSV File</Label>
                                <ReactFileReader handleFiles={handleFiles} fileTypes={[".csv"]} base64={true} multipleFiles={true}>
                                    <Button className='btn'>Upload</Button>
                                </ReactFileReader>
                            </span>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <ModalFooterActions>
                        <Button variant="secondary" onClick={handleClose}>
                            Cancel
                        </Button>
                    </ModalFooterActions>
                </ModalFooter>
            </Modal>
        </div>
    );
}

const removeCampaign = () => {

}

useEffect(() => {
    let currentCampaigns = [];
    let readData = JSON.stringify({
        "TableName": "OutboundRules"
    });
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${process.env.REACT_APP_URL}/readSettings`,
        headers: {},
        data: readData
    };
    console.log(config)
    axios.request(config)
        .then((response) => {
            let items = response.data.items
            console.log("I", items)
            for (let i = 0; i < items.length; i++) {
                currentCampaigns.push(items[i].campaign)
            }
            console.log("CC", currentCampaigns)
        })
        .catch((error) => {
            console.log(error);
        });
    setCampaign(currentCampaigns);
    console.log(`Campaign(s) are: ${currentCampaigns}`)

}, []);
return (
    <div id="body" style={{ width: '50%' }}>
        <Heading as="h1" variant="heading10">
            Outbound Campaign Contact List
        </Heading>
        <table>
            <tbody>
                <tr>
                    <td>
                        <Combobox
                            items={campaign}
                            labelText="Select a Campaign"
                            value={siteCampaign}
                            required
                            onInputValueChange={({ inputValue }) => {
                                setSiteCampaign(inputValue);
                                setSelectedCampaign(true);
                                loadCampaign(inputValue)
                            }}
                        />
                    </td>
                    <td></td>
                    <td> <span>
                        <Label>&zwnj;</Label>
                        <Button onClick={() => removeCampaign(siteCampaign)}>Delete Contact List</Button>
                    </span></td>
                    <td></td>
                    <td>
                        <Label>&zwnj;</Label>
                        <AddCampaignModal
                            isModalOpen={isModalOpen}
                        //handleClose={closeModal}
                        //onSubmit={handleFormSubmit}
                        />
                    </td>
                </tr>
            </tbody>
        </table>
        <br />
        {selectedCampaign ? <Table striped="true">
            <THead>
                <Tr>
                    <Th><strong>Contacts</strong></Th>
                    <Th></Th>
                    <Th></Th>
                </Tr>
                <Tr>
                    <Th >Customer Number</Th>
                    <Th >Customer Name</Th>
                    <Th></Th>
                </Tr>
            </THead>
            <TBody>
                {updateCampaign.map((campaignList, index) => (
                    <Tr key={"row" + index}>
                        <Td key={"number" + index}>{campaignList.phoneNumber}</Td>
                        <Td key={"name" + index}>{campaignList.name}</Td>
                        <Td key={"button" + index} textAlign='left'>
                            <Button variant="secondary" textAlign='left' size="small" onClick={() => removeNumber(campaignList.phoneNumber, campaignList.name)}><DeleteIcon decorative={false} title="Delete" /></Button>
                        </Td>
                    </Tr>
                ))}
            </TBody>
        </Table> : null}
        <br />

        <Toaster left={['space180', 'unset', 'unset']} {...toaster} />
    </div>
)
};