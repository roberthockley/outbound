import React, { useEffect } from 'react';
import { useToaster, Toaster } from '@twilio-paste/core/toast';
import axios from 'axios';
import { Label } from '@twilio-paste/core';
import { useUID } from '@twilio-paste/core/uid-library';
import { Input } from '@twilio-paste/core/input';
import { Heading } from '@twilio-paste/core/heading';
import { Button } from '@twilio-paste/core/button';
import { Table, THead, Tr, Td, Th, TBody, TFoot } from '@twilio-paste/core/table';
import { DeleteIcon } from "@twilio-paste/icons/esm/DeleteIcon";
import { Modal, ModalBody, ModalFooter, ModalFooterActions, ModalHeader, ModalHeading } from '@twilio-paste/core/modal';


let newData = []
let disposition2;

export const SiteDisposition = () => {

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false)
    const [isModalOpen, setModalOpen] = React.useState(false);
    const [dispositionsList, setDispositionsList] = React.useState(newData);
    const toaster = useToaster();
    let handleFormSubmit //=console.log("Submit")

    const removeDisposition = (labelToRemove, valueToRemove) => {
        let newDispositionList = []
        for (let i = 0; i < dispositionsList.length; i++) {
            if (dispositionsList[i].value == valueToRemove) {
                console.log("Removing", valueToRemove)
            } else {
                newDispositionList.push(dispositionsList[i])
            }
        }
        localStorage.setItem('dispositions', JSON.stringify(newDispositionList));
        setDispositionsList(newDispositionList)
    }

    const AddDispositionModal = () => {
        const uidDP = useUID();
        const uidHT = useUID();
        const [isOpen, setIsOpen] = React.useState(false);
        const handleOpen = () => {
            setIsOpen(true)
            console.log("Modal Open");
        }
        const handleClose = () => {
            setIsOpen(false)
            console.log("Modal closed")
        };

        const addDisposition = () => {
            setIsOpen(false);
            let updates = {}
            let valuesToCheck = []
            for (let i = 0; i < dispositionsList.length; i++) {
                valuesToCheck.push(dispositionsList[i].value)
            }
            console.log(valuesToCheck)
            if (valuesToCheck.indexOf(value) !== -1) {
                toaster.push({
                    message: 'Disposition Exists',
                    variant: 'error',
                    dismissAfter: 3000
                })
            } else {
                updates.label = label
                updates.value = value
                let labelsToUpdate = dispositionsList
                labelsToUpdate.push(updates)

                let makeData = JSON.stringify({
                    "TableName": "Dispositions",
                    "Item": {
                        "value": {
                            "S": value
                        },
                        "label": {
                            "S": label
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

                localStorage.setItem('dispositions', JSON.stringify(labelsToUpdate));
                toaster.push({
                    message: 'Disposition added',
                    variant: 'success',
                    dismissAfter: 3000
                })
            }
        };

        const modalHeadingID = useUID();
        const nameInputRef = React.createRef();
        const numberInputRef = React.createRef();
        const [label, setLabel] = React.useState('');
        const [value, setValue] = React.useState('');
        return (
            <div>
                <Button variant="primary" onClick={handleOpen}>
                    New Disposition Code
                </Button>
                <Modal ariaLabelledby={modalHeadingID} isOpen={isOpen} onDismiss={handleClose} size="default">
                    <ModalHeader>
                        <ModalHeading as="h3" id={modalHeadingID}>
                            New Disposition Code
                        </ModalHeading>
                    </ModalHeader>
                    <ModalBody>
                        <Label htmlFor={uidDP + 2} >
                        </Label>
                        <Label>Disposition Code Label</Label>
                        <Input
                            type="text"
                            id={modalHeadingID + 2}
                            onChange={e => setLabel(e.currentTarget.value)}
                        />
                        <Label htmlFor={uidDP}>
                        </Label>
                        <Label>Disposition Code Value</Label>
                        <Input
                            type="text"
                            id={modalHeadingID}
                            onChange={e => setValue(e.currentTarget.value)}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <ModalFooterActions>
                            <Button variant="secondary" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button variant="primary" onClick={addDisposition}>Submit</Button>
                        </ModalFooterActions>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }

    useEffect(() => {
        let currentDispositionsLists = [];
        let readData = JSON.stringify({
            "TableName": "Dispositions"
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
                    currentDispositionsLists.push(items[i].label)
                }
                setDispositionsList(items);
                console.log(`DispositionsList(s) are: ${currentDispositionsLists}`)
            })
            .catch((error) => {
                console.log(error);
            })
    }, []);
    return (
        <div id="body" style={{ width: '50%' }}>
            <Heading as="h1" variant="heading10">
                Disposition Codes
            </Heading>
            <Table aria-label="number-grid" id="number-grid" striped="true" >
                <THead stickyHeader top={0}>
                    <Tr>
                        <Th >Disposition Code Label</Th>
                        <Th >Description Code Value</Th>
                        <Th> <AddDispositionModal
                            isModalOpen={isModalOpen}
                            handleClose={closeModal}
                            onSubmit={handleFormSubmit}
                        />
                        </Th>
                    </Tr>
                </THead>
                <TBody>
                    {dispositionsList.map((dispositionList, index) => (
                        <Tr key={"row" + index}>
                            <Td key={"label" + index}>{dispositionList.label}</Td>
                            <Td key={"desc" + index}>{dispositionList.value}</Td>
                            <Td key={"button" + index} textAlign='left'>
                                <Button variant="secondary" textAlign='left' size="small" onClick={() => removeDisposition(dispositionList.label, dispositionList.value)}><DeleteIcon decorative={false} title="Delete" /></Button>
                            </Td>
                        </Tr>
                    ))}
                </TBody>
            </Table>
            <Toaster left={['space180', 'unset', 'unset']} {...toaster} />
        </div>
    )
};