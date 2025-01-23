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

    const [dynamoDisposition, setDynamoDisposition] = React.useState([]);
    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false)
    const [isModalOpen, setModalOpen] = React.useState(false);
    const toaster = useToaster();
    let handleFormSubmit //=console.log("Submit")

    const removeDisposition = (codeToRemove) => { 
        let newDispositionList = []
        for (let i = 0; i < dynamoDisposition.length; i++) {
            if(dynamoDisposition[i].code == codeToRemove){
                console.log("Removing", codeToRemove)
            }else{
                newDispositionList.push(dynamoDisposition[i])
            }
        }
        localStorage.setItem('dispositions', JSON.stringify(newDispositionList));
        setDynamoDisposition(newDispositionList)
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
            let codesToCheck = []
            for (let i = 0; i < dynamoDisposition.length; i++) {
                codesToCheck.push(dynamoDisposition[i].code)
            }
            console.log(codesToCheck)
            if (codesToCheck.indexOf(code) !== -1) {
                    toaster.push({
                        message: 'Disposition Exists',
                        variant: 'error',
                        dismissAfter: 3000
                    })
                }else{
                    updates.code = code
                    updates.description = description
                    let codesToUpdate = dynamoDisposition
                    codesToUpdate.push(updates)
                    localStorage.setItem('dispositions', JSON.stringify(codesToUpdate));
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
        const [code, setCode] = React.useState('');
        const [description, setDescription] = React.useState('');
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
                        <Label htmlFor={uidDP + 2} required>
                        </Label>
                        <Label>Disposition Code</Label>
                        <Input
                            type="text"
                            id={modalHeadingID + 2}
                            onChange={e => setCode(e.currentTarget.value)}
                        />
                        <Label htmlFor={uidDP} required>
                        </Label>
                        <Label>Description</Label>
                        <Input
                            type="text"
                            id={modalHeadingID}
                            onChange={e => setDescription(e.currentTarget.value)}
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
        let currentDisposition = [];
        setDynamoDisposition(JSON.parse(localStorage.getItem('dispositions')))
        console.log(`Disposition(s) are: ${currentDisposition}`)
    }, []);
    return (
        <div id="body" style={{ width: '50%' }}>
            <Heading as="h1" variant="heading10">
                Disposition Codes
            </Heading>
            <Table aria-label="number-grid" id="number-grid" striped="true" >
                <THead stickyHeader top={0}>
                    <Tr>
                        <Th >Disposition Code</Th>
                        <Th >Description</Th>
                        <Th> <AddDispositionModal
                            isModalOpen={isModalOpen}
                            handleClose={closeModal}
                            onSubmit={handleFormSubmit}
                        />
                        </Th>
                    </Tr>
                </THead>
                <TBody>
                    {dynamoDisposition.map((dispositionList, index) => (
                        <Tr key={"row" + index}>
                            <Td key={"code" + index}>{dispositionList.code}</Td>
                            <Td key={"desc" + index}>{dispositionList.description}</Td>
                            <Td key={"button" + index} textAlign='left'>
                                <Button variant="secondary" textAlign='left' size="small" onClick={() => removeDisposition(dispositionList.code, dispositionList.description)}><DeleteIcon decorative={false} title="Delete" /></Button>
                            </Td>
                        </Tr>
                    ))}
                </TBody>
            </Table>
            <Toaster left={['space180', 'unset', 'unset']} {...toaster} />
        </div>
    )
};