import { Combobox } from '@twilio-paste/core/combobox';
import React, { useEffect } from 'react';
import { useToaster, Toaster } from '@twilio-paste/core/toast';
import { Label } from '@twilio-paste/core';
import axios from 'axios';
import { Heading } from '@twilio-paste/core/heading';
import { Button } from '@twilio-paste/core/button';
import { Table, THead, Tr, Td, Th, TBody } from '@twilio-paste/core/table';
import { Modal, ModalBody, ModalFooter, ModalFooterActions, ModalHeader, ModalHeading } from '@twilio-paste/core/modal';
import { useUID } from '@twilio-paste/core/uid-library';
import ReactFileReader from 'react-file-reader';
import { DeleteIcon } from "@twilio-paste/icons/esm/DeleteIcon";

let newData = []

export const SiteCampaigns = () => {
    const [campaign, setCampaign] = React.useState(newData);
    const [siteCampaign, setSiteCampaign] = React.useState(newData);
    const [updateCampaign, setUpdateCampaign] = React.useState([]);
    const [selectedCampaign, setSelectedCampaign] = React.useState(false);
    const [isModalOpen, setModalOpen] = React.useState(false);
    const toaster = useToaster();
    const [fileData, setFileData] = React.useState("");
    const [isOpen, setIsOpen] = React.useState(false);

    const removeNumber = (number, name) => {
        console.log(`****** Remove Number`, number, name);

        // Filter out the number to remove
        const updatedCampaign = updateCampaign.filter(item => item.phoneNumber !== number);

        // Update state with the filtered list
        setUpdateCampaign(updatedCampaign);

        // Prepare delete request
        const deleteData = JSON.stringify({
            TableName: `${siteCampaign}-Campaign`,
            Key: {
                phoneNumber: { S: number }
            }
        });

        const deleteConfig = {
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
    };

    const loadCampaign = (campaignName) => {
        let currentCampaigns = [];
        let readData = JSON.stringify({
            "TableName": `${campaignName}-Campaign`
        });
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${process.env.REACT_APP_URL}/scanTable`,
            headers: {},
            data: readData
        };
        console.log(config)
        axios.request(config)
            .then((response) => {
                let items = response.data.items
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
            if (selectedCampaign) {
                setIsOpen(true)
                console.log("Modal Open");
            } else {
                toaster.push({
                    message: 'Select Campaign First',
                    variant: 'error',
                    dismissAfter: 3000
                })
            }
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
                "data": importFileData,
                "tableName": `${siteCampaign}-Campaign`
            });

            let csvUploadConfig = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `${process.env.REACT_APP_URL}/csvUpload`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: csvUploadData
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
                    Upload Contact List
                </Button>
                <Modal ariaLabelledby={modalHeadingID} isOpen={isOpen} onDismiss={handleClose} size="default">
                    <ModalHeader>
                        <ModalHeading as="h3" id={modalHeadingID}>
                            Upload Contact List
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
        if (selectedCampaign) {
        } else {
            toaster.push({
                message: 'Select Campaign First',
                variant: 'error',
                dismissAfter: 3000
            })
        }
    }

    useEffect(() => {
        let currentCampaigns = [];
        let readData = JSON.stringify({
            "TableName": "OutboundRules"
        });
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${process.env.REACT_APP_URL}/scanTable`,
            headers: {},
            data: readData
        };
        console.log(config)
        axios.request(config)
            .then((response) => {
                let items = response.data.Items
                console.log("I", items)
                for (let i = 0; i < items.length; i++) {
                    currentCampaigns.push(items[i].campaign.S)
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