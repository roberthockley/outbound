import { Combobox } from '@twilio-paste/core/combobox';
import React, { useEffect } from 'react';
import { useToaster, Toaster } from '@twilio-paste/core/toast';
import axios from 'axios';
import { Input } from '@twilio-paste/core/input';
import { Heading } from '@twilio-paste/core/heading';
import { Button } from '@twilio-paste/core/button';
import { Table, THead, Tr, Td, Th, TBody } from '@twilio-paste/core/table';
import { Label } from '@twilio-paste/core';
import { Modal, ModalBody, ModalFooter, ModalFooterActions, ModalHeader, ModalHeading } from '@twilio-paste/core/modal';
import { useUID } from '@twilio-paste/core/uid-library';
import ReactFileReader from 'react-file-reader';
import { DeleteIcon } from "@twilio-paste/icons/esm/DeleteIcon";
let newData = []

export const SiteDND = () => {
    const [dndList, setDNDList] = React.useState(newData);
    const [siteDNDList, setSiteDNDList] = React.useState(newData);
    const [updateDNDList, setUpdateDNDList] = React.useState([]);
    const [selectedDNDList, setSelectedDNDList] = React.useState(false);
    const [isModalOpen, setModalOpen] = React.useState(false);
    const toaster = useToaster();
    const [fileData, setFileData] = React.useState("");
    const [isOpen, setIsOpen] = React.useState(false);

    const removeNumber = (number, name) => {
        console.log(`****** Remove Number`, number, name);
        const updatedDNDList = updateDNDList.filter(item => item.phoneNumber !== number);
        setUpdateDNDList(updatedDNDList);
        const deleteData = JSON.stringify({
            TableName: `${siteDNDList}-DND`,
            Key: {
                phoneNumber: { S: number }
            }
        });

        const deleteConfig = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${process.env.REACT_APP_URL}/deleteItem`,
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

    const loadDNDList = (dndName) => {
        console.log("dndName",dndName)
        let readData = JSON.stringify({
            "TableName": `${dndName}-DND`
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
                console.log("items",items)
                setUpdateDNDList(items)
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const AddListModal = (prop) => {
        const [isOpen, setIsOpen] = React.useState(false);
        const handleOpen = () => {
            setIsOpen(true)
            console.log("Modal Open");
        }
        const handleClose = () => {
            setIsOpen(false)
            console.log("Modal closed")
        };
        const addCampaign = () => {

            if (dndList.indexOf(listName) !== -1) {
                console.log("-1")
                toaster.push({
                    message: 'List Name already Exists',
                    variant: 'error',
                    dismissAfter: 3000
                })
            } else {
                let updatedDrop = dndList
                updatedDrop.push(listName)
                setUpdateDNDList([])
                setSiteDNDList(listName)
                setIsOpen(false)
                setDNDList(updatedDrop)
                let makeData = JSON.stringify({
                    "TableName": "DND",
                    "Item": {
                        "name": {
                            "S": listName
                        }
                    }
                });

                let config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: `${process.env.REACT_APP_URL}/putItem`,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: makeData
                };

                axios.request(config)
                    .then((response) => {
                        console.log(response)
                    })
                    .catch((error) => {
                        console.log(error);
                    });

                let createCampaignData = JSON.stringify({
                    "AttributeDefinitions": [
                        {
                            "AttributeName": "phoneNumber",
                            "AttributeType": "S"
                        }
                    ],
                    "TableName": `${listName}-DND`,
                    "KeySchema": [
                        {
                            "AttributeName": "phoneNumber",
                            "KeyType": "HASH"
                        }
                    ],
                    "BillingMode": "PAY_PER_REQUEST"
                });

                let createCampaignConfig = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: `${process.env.REACT_APP_URL}/createTable`,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: createCampaignData
                };

                axios.request(createCampaignConfig)
                    .then((response) => {
                        toaster.push({
                            message: 'DND List Created',
                            variant: 'success',
                            dismissAfter: 3000
                        })
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        }
        const modalHeadingID = useUID();
        const [listName, setListName] = React.useState('');
        return (
            <div>
                <Button variant="primary" onClick={handleOpen}>
                    New List
                </Button>
                <Modal ariaLabelledby={modalHeadingID} isOpen={isOpen} onDismiss={handleClose} size="default">
                    <ModalHeader>
                        <ModalHeading as="h3" id={modalHeadingID}>
                            New List
                        </ModalHeading>
                    </ModalHeader>
                    <ModalBody>
                        <Label>Do Not Call List Name</Label>
                        <Input
                            type="text"
                            id={modalHeadingID}
                            onChange={e => setListName(e.currentTarget.value)}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <ModalFooterActions>
                            <Button variant="secondary" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button variant="primary" onClick={addCampaign}>Submit</Button>
                        </ModalFooterActions>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }

    const UploadDNDListModal = (prop) => {
        const handleOpen = () => {
            if (selectedDNDList) {
                setIsOpen(true)
                console.log("Modal Open");
            } else {
                toaster.push({
                    message: 'Select DNDList First',
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
                "tableName": `${siteDNDList}-DND`
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
                    loadDNDList(siteDNDList)
                })
                .catch((error) => {
                    console.log(error);
                });
        };
        const modalHeadingID = useUID();
        return (
            <div>
                <Button variant="primary" onClick={handleOpen}>
                    Upload List
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

    const removeDNDList = () => {
        if (siteDNDList === "Global") {
            toaster.push({
                message: 'Global List Cannot Be Deleted',
                variant: 'error',
                dismissAfter: 3000
            })
        } else if (selectedDNDList) {
            let deleteData = JSON.stringify({
                "TableName": "DND",
                "Key": {
                    "name": {
                        "S": siteDNDList
                    }
                }
            });

            let deleteConfig = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `${process.env.REACT_APP_URL}/deleteItem`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: deleteData
            };
            console.log(deleteConfig)
            axios.request(deleteConfig)
                .then((response) => {                    
                })
                .catch((error) => {
                    console.log(error);
                });
            
                let deleteTableData = JSON.stringify({
                    "TableName": `${siteDNDList}-DND`,
                });
    
                let deleteTableConfig = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: `${process.env.REACT_APP_URL}/deleteTable`,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    data: deleteTableData,
                };
    
                console.log(deleteTableConfig);
                axios.request(deleteTableConfig)
                    .then((response) => {
                        toaster.push({
                            message: 'List Deleted',
                            variant: 'success',
                            dismissAfter: 3000,
                        });
                        const updatedList = dndList.filter((item) => item !== siteDNDList);
                        setDNDList(updatedList); // Update dropdown options
                        setSiteDNDList("Global")
                        loadDNDList("Global");
                        setUpdateDNDList([]); // Clear current list before reload
                        setTimeout(() => loadDNDList("Global"), 0); // Force re-render
                    })
                    .catch((error) => {
                        console.log(error);
                    });
                
        } else {
            toaster.push({
                message: 'Select DNDList First',
                variant: 'error',
                dismissAfter: 3000
            })
        }
    }

    useEffect(() => {
        let currentDNDLists = [];
        let readData = JSON.stringify({
            "TableName": "DND"
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
                console.log("I", items)
                for (let i = 0; i < items.length; i++) {
                    currentDNDLists.push(items[i].name)
                }
                setDNDList(currentDNDLists);
                console.log(`DNDList(s) are: ${currentDNDLists}`)
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);
    return (
        <div id="body" style={{ width: '50%' }}>
            <Heading as="h1" variant="heading10">
                Outbound Do Not Disturb List
            </Heading>
            <table>
                <tbody>
                    <tr>
                        <td>
                            <Combobox
                                items={dndList}
                                labelText="Select a DNDList"
                                value={siteDNDList}
                                required
                                onInputValueChange={({ inputValue }) => {
                                    setSiteDNDList(inputValue);
                                    setSelectedDNDList(true);
                                    loadDNDList(inputValue)
                                }}
                            />
                        </td>
                        <td></td>
                        <td>
                            <Label>&zwnj;</Label>
                            <UploadDNDListModal
                                isModalOpen={isModalOpen}
                            //handleClose={closeModal}
                            //onSubmit={handleFormSubmit}
                            />
                        </td>
                        <td>
                            <Label>&zwnj;</Label>
                            <AddListModal
                                isModalOpen={isModalOpen}
                            />
                        </td>
                        <td>
                            <Label>&zwnj;</Label>
                            <Button variant="primary" onClick={removeDNDList}>
                                Delete List
                            </Button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <br />
            {selectedDNDList ? <Table striped="true">
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
                    {updateDNDList.map((dndList, index) => (

                        <Tr key={"row" + index}>
                            {console.log(dndList)}
                            <Td key={"number" + index}>{dndList.phoneNumber}</Td>
                            <Td key={"name" + index}>{dndList.name}</Td>
                            <Td key={"button" + index} textAlign='left'>
                                <Button variant="secondary" textAlign='left' size="small" onClick={() => removeNumber(dndList.phoneNumber, dndList.name)}><DeleteIcon decorative={false} title="Delete" /></Button>
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