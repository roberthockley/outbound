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


let newData = []
let campaigns2;
let timezones = ["Asia/Bangkok",
    "Asia/Brunei",
    "Asia/Calcutta",
    "Asia/Colombo",
    "Asia/Dubai",
    "Asia/Ho_Chi_Minh",
    "Asia/Hong_Kong",
    "Asia/Jakarta",
    "Asia/Kuala_Lumpur",
    "Asia/Kuwait",
    "Asia/Manila",
    "Asia/Qatar",
    "Asia/Seoul",
    "Asia/Shanghai",
    "Asia/Singapore",
    "Asia/Taipei",
    "Asia/Tokyo"]

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
    const [updateCamapign, setUpdateCampaign] = React.useState(true);
    const [showTimes, setShowTimes] = React.useState(false);
    const [selectedCampaign, setSelectedCampaign] = React.useState(false);
    const [dynamoCampaigns, setDynamoCampaigns] = React.useState("");
    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false)
    const [isModalOpen, setModalOpen] = React.useState(false);
    const toaster = useToaster();

    const saveRules = () => {
        console.log(retries)
        if (!retries) {
            toaster.push({
                message: 'Set Retries per Day first',
                variant: 'error',
                dismissAfter: 3000
            })
        }
        if (!retriesWeek) {
            toaster.push({
                message: 'Set Retries per Week first',
                variant: 'error',
                dismissAfter: 3000
            })
        }
        if (!interval) {
            toaster.push({
                message: 'Set Time Between Retries first',
                variant: 'error',
                dismissAfter: 3000
            })
        }
        if (!duration) {
            toaster.push({
                message: 'Set Minimum Ring Duration first',
                variant: 'error',
                dismissAfter: 3000
            })
        }
        else {
            toaster.push({
                message: 'Set Multiple Schedules first',
                variant: 'error',
                dismissAfter: 3000
            })
        }
        if (!callerId) {
            toaster.push({
                message: 'Set Caller Id first',
                variant: 'error',
                dismissAfter: 3000
            })
        }
        if (!dnd) {
            toaster.push({
                message: 'Set Do Not Call List first',
                variant: 'error',
                dismissAfter: 3000
            })
        }
        if (!start) {
            toaster.push({
                message: 'Set Start Date first',
                variant: 'error',
                dismissAfter: 3000
            })
        }
        if (!end) {
            toaster.push({
                message: 'Set End Date first',
                variant: 'error',
                dismissAfter: 3000
            })
        }
        console.log(updateCamapign)
        if (updateCamapign === false) {
            let updates = {};
            updates.campaign = siteCampaign;
            updates.retry = retries;
            updates.duration = duration;
            updates.interval = interval;
            updates.retriesWeek = retriesWeek;
            updates.callerId = callerId;
            updates.dnd = dnd;
            updates.start = start;
            updates.end = end;
            updates.enabled = enabled;
            updates.timezone = tz;
            dynamoCampaigns.push(updates);
            localStorage.setItem('campaigns', JSON.stringify(dynamoCampaigns));
            setUpdateCampaign(true)
        } else {
            for (let i = 0; i < dynamoCampaigns.length; i++) {
                console.log(dynamoCampaigns[i].campaign, siteCampaign)
                if (dynamoCampaigns[i].campaign === siteCampaign) {
                    dynamoCampaigns[i].retry = retries;
                    dynamoCampaigns[i].duration = duration;
                    dynamoCampaigns[i].interval = interval;
                    dynamoCampaigns[i].retriesWeek = retriesWeek;
                    dynamoCampaigns[i].callerId = callerId;
                    dynamoCampaigns[i].dnd = dnd;
                    dynamoCampaigns[i].start = start;
                    dynamoCampaigns[i].end = end;
                    dynamoCampaigns[i].enabled = enabled;
                    dynamoCampaigns[i].timezone = tz;
                }
            }
            localStorage.setItem('campaigns', JSON.stringify(dynamoCampaigns));
        }
    }

    const AddCampaignModal = (prop) => {
        const uidDP = useUID();
        const uidHT = useUID();
        let location = prop.location
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
            if (campaign.indexOf(listName) !== -1) {
                console.log("-1")
                toaster.push({
                    message: 'List Name already Exists',
                    variant: 'error',
                    dismissAfter: 3000
                })
            } else {
                let updatedDrop = campaign
                updatedDrop.push(listName)
                setCampaign(updatedDrop)
                setIsOpen(false)
                setSiteCampaign(listName);
                setSelectedCampaign(true);
                setShowTimes(true);
                setUpdateCampaign(false);
                //Call API Gateway to Create Table, EventBridge Rule and Update Lambda
            }
        }
        const modalHeadingID = useUID();
        const nameInputRef = React.createRef();
        const dateInputRef = React.createRef();
        const [listName, setListName] = React.useState('');
        return (
            <div>
                <Button variant="primary" onClick={handleOpen}>
                    New Contact list
                </Button>
                <Modal ariaLabelledby={modalHeadingID} isOpen={isOpen} onDismiss={handleClose} size="default">
                    <ModalHeader>
                        <ModalHeading as="h3" id={modalHeadingID}>
                        New Contact list
                        </ModalHeading>
                    </ModalHeader>
                    <ModalBody>
                        <Label>Campaign Name</Label>
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

    const removeCampaign = () => {
        console.log(siteCampaign)
        if(siteCampaign.length === 0){
            toaster.push({
                message: 'Select List First',
                variant: 'error',
                dismissAfter: 3000
            })
        }
        let campaignToUpdate = []
        let newCampaign = []
        for (let i = 0; i < dynamoCampaigns.length; i++) {
            if(dynamoCampaigns[i].campaign === siteCampaign){
                console.log(siteCampaign, "found" ,i)
            }else{
                campaignToUpdate.push(dynamoCampaigns[i])
                newCampaign.push(dynamoCampaigns[i].campaign)
            }
        }

        setCampaign(newCampaign);
        setSiteCampaign([])
        setSelectedCampaign(false)
        setShowTimes(false)
        setDynamoCampaigns(campaignToUpdate)
        localStorage.setItem('campaigns', JSON.stringify(campaignToUpdate));
    }

    useEffect(() => {
        let currentCampaigns = [];
        setDynamoCampaigns(JSON.parse(localStorage.getItem('campaigns')))
        let campaigns2 = JSON.parse(localStorage.getItem('campaigns'))
        for (let i = 0; i < campaigns2.length; i++) {
            let items = campaigns2[i]
            currentCampaigns.push(items.campaign)
        }
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
                                    for (let i = 0; i < dynamoCampaigns.length; i++) {
                                        if (dynamoCampaigns[i].campaign === inputValue) {
                                            console.log(dynamoCampaigns[i])
                                            setRetries(dynamoCampaigns[i].retry)
                                            setRetriesWeek(dynamoCampaigns[i].retriesWeek)
                                            setInterval(dynamoCampaigns[i].interval)
                                            setDuration(dynamoCampaigns[i].duration)
                                            setCallerId(dynamoCampaigns[i].callerId)
                                            setDND(dynamoCampaigns[i].dnd)
                                            setStart(dynamoCampaigns[i].start)
                                            setEnd(dynamoCampaigns[i].end)
                                            setEnabled(dynamoCampaigns[i].enabled)
                                            setTZ(dynamoCampaigns[i].timezone)
                                        }
                                    }
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
                        <Th></Th>
                    </Tr>
                </THead>
                <TBody>
                    
                </TBody>
                <TFoot>
                    <Tr>
                        <Td></Td>
                        <Td></Td>
                        <Td></Td>
                        <Td align='center'><Button variant="primary" onClick={saveRules}>Refresh</Button>
                        </Td>
                    </Tr>
                </TFoot>
            </Table> : null}
            <br />

            <Toaster left={['space180', 'unset', 'unset']} {...toaster} />
        </div>
    )
};