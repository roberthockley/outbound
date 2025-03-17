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

export const SiteSettings = () => {
    const [campaign, setCampaign] = React.useState(newData);
    const [siteCampaign, setSiteCampaign] = React.useState(newData);
    const [retries, setRetries] = React.useState();
    const [retriesWeek, setRetriesWeek] = React.useState();
    const [intervalBusy, setIntervalBusy] = React.useState();
    const [intervalNOAN, setIntervalNOAN] = React.useState();
    const [intervalAM, setIntervalAM] = React.useState();
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
    const [multiTimes, setMultiTimes] = React.useState(false);
    const [mondayStart1, setMondayStart1] = React.useState("09:00:00");
    const [mondayEnd1, setMondayEnd1] = React.useState("12:00:00");
    const [mondayChecked, setMondayChecked] = React.useState(false);
    const [mondayHelp1, setMondayHelp1] = React.useState(false);
    const [tuesdayStart1, setTuesdayStart1] = React.useState("09:00:00");
    const [tuesdayEnd1, setTuesdayEnd1] = React.useState("12:00:00");
    const [tuesdayChecked, setTuesdayChecked] = React.useState(false);
    const [tuesdayHelp1, setTuesdayHelp1] = React.useState(false);
    const [wednesdayStart1, setWednesdayStart1] = React.useState("09:00:00");
    const [wednesdayEnd1, setWednesdayEnd1] = React.useState("12:00:00");
    const [wednesdayChecked, setWednesdayChecked] = React.useState(false);
    const [wednesdayHelp1, setWednesdayHelp1] = React.useState(false);
    const [thursdayStart1, setThursdayStart1] = React.useState("09:00:00");
    const [thursdayEnd1, setThursdayEnd1] = React.useState("12:00:00");
    const [thursdayChecked, setThursdayChecked] = React.useState(false);
    const [thursdayHelp1, setThursdayHelp1] = React.useState(false);
    const [fridayStart1, setFridayStart1] = React.useState("09:00:00");
    const [fridayEnd1, setFridayEnd1] = React.useState("12:00:00");
    const [fridayChecked, setFridayChecked] = React.useState(false);
    const [fridayHelp1, setFridayHelp1] = React.useState(false);
    const [saturdayStart1, setSaturdayStart1] = React.useState("09:00:00");
    const [saturdayEnd1, setSaturdayEnd1] = React.useState("12:00:00");
    const [saturdayChecked, setSaturdayChecked] = React.useState(false);
    const [saturdayHelp1, setSaturdayHelp1] = React.useState(false);
    const [sundayStart1, setSundayStart1] = React.useState("09:00:00");
    const [sundayEnd1, setSundayEnd1] = React.useState("12:00:00");
    const [sundayChecked, setSundayChecked] = React.useState(false);
    const [sundayHelp1, setSundayHelp1] = React.useState(false);
    const [mondayStart2, setMondayStart2] = React.useState("23:58:00");
    const [mondayEnd2, setMondayEnd2] = React.useState("23:59:00");
    const [mondayHelp2, setMondayHelp2] = React.useState(false);
    const [tuesdayStart2, setTuesdayStart2] = React.useState("23:58:00");
    const [tuesdayEnd2, setTuesdayEnd2] = React.useState("23:59:00");
    const [tuesdayHelp2, setTuesdayHelp2] = React.useState(false);
    const [wednesdayStart2, setWednesdayStart2] = React.useState("23:58:00");
    const [wednesdayEnd2, setWednesdayEnd2] = React.useState("23:59:00");
    const [wednesdayHelp2, setWednesdayHelp2] = React.useState(false);
    const [thursdayStart2, setThursdayStart2] = React.useState("23:58:00");
    const [thursdayEnd2, setThursdayEnd2] = React.useState("23:59:00");
    const [thursdayHelp2, setThursdayHelp2] = React.useState(false);
    const [fridayStart2, setFridayStart2] = React.useState("23:58:00");
    const [fridayEnd2, setFridayEnd2] = React.useState("23:59:00");
    const [fridayHelp2, setFridayHelp2] = React.useState(false);
    const [saturdayStart2, setSaturdayStart2] = React.useState("23:58:00");
    const [saturdayEnd2, setSaturdayEnd2] = React.useState("23:59:00");
    const [saturdayHelp2, setSaturdayHelp2] = React.useState(false);
    const [sundayStart2, setSundayStart2] = React.useState("23:58:00");
    const [sundayEnd2, setSundayEnd2] = React.useState("23:59:00");
    const [sundayHelp2, setSundayHelp2] = React.useState(false);
    const [mondayHelp3, setMondayHelp3] = React.useState(false);
    const [tuesdayHelp3, setTuesdayHelp3] = React.useState(false);
    const [wednesdayHelp3, setWednesdayHelp3] = React.useState(false);
    const [thursdayHelp3, setThursdayHelp3] = React.useState(false);
    const [fridayHelp3, setFridayHelp3] = React.useState(false);
    const [saturdayHelp3, setSaturdayHelp3] = React.useState(false);
    const [sundayHelp3, setSundayHelp3] = React.useState(false);
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
        if (!intervalBusy) {
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
        if (multiTimes === true || multiTimes === false) {
            console.log("Multitimes set")
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
            updates.intervalBusy = intervalBusy;
            updates.retriesWeek = retriesWeek;
            updates.callerId = callerId;
            updates.dnd = dnd;
            updates.shift = multiTimes;
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
                    dynamoCampaigns[i].intervalBusy = intervalBusy;
                    dynamoCampaigns[i].retriesWeek = retriesWeek;
                    dynamoCampaigns[i].callerId = callerId;
                    dynamoCampaigns[i].dnd = dnd;
                    dynamoCampaigns[i].shift = multiTimes;
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
            }
        }
        const modalHeadingID = useUID();
        const nameInputRef = React.createRef();
        const dateInputRef = React.createRef();
        const [listName, setListName] = React.useState('');
        return (
            <div>
                <Button variant="primary" onClick={handleOpen}>
                    New Campaign
                </Button>
                <Modal ariaLabelledby={modalHeadingID} isOpen={isOpen} onDismiss={handleClose} size="default">
                    <ModalHeader>
                        <ModalHeading as="h3" id={modalHeadingID}>
                            New Campaign
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

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${process.env.REACT_APP_URL}/readSettings`,
            headers: { }
        };
        console.log(config)
        axios.request(config)
            .then((response) => {
                let items = response.data.items
                setDynamoCampaigns(items)
                for (let i = 0; i < items.length; i++) {
                    currentCampaigns.push(items[i].campaign)
                }
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
                Outbound Campaign Settings
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
                                            setIntervalBusy(dynamoCampaigns[i].intervalBusy)
                                            setDuration(dynamoCampaigns[i].duration)
                                            setMultiTimes(dynamoCampaigns[i].shift)
                                            setCallerId(dynamoCampaigns[i].callerId)
                                            setDND(dynamoCampaigns[i].dnd)
                                            setStart(dynamoCampaigns[i].start)
                                            setEnd(dynamoCampaigns[i].end)
                                            setEnabled(dynamoCampaigns[i].enabled)
                                            setTZ(dynamoCampaigns[i].timezone)
                                            console.log(multiTimes, dynamoCampaigns[i].shift)
                                        }
                                    }

                                }}
                            />
                        </td>
                        <td></td>
                        <td> <span>
                            <Label>&zwnj;</Label>
                            <Button onClick={() => removeCampaign(siteCampaign)}>Delete Campaign</Button>
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
                        <Th><strong>Settings</strong></Th>
                        <Th></Th>
                        <Th></Th>
                        <Th></Th>
                    </Tr>
                </THead>
                <TBody>
                    <Tr>
                        <Td>Enabled</Td>
                        <Td></Td>
                        <Td></Td>
                        <Td><Combobox
                            items={["True", "False"]}
                            value={enabled}
                            onInputValueChange={({ inputValue }) => {
                                if (inputValue === "True") {
                                    setEnabled(true)
                                } else {
                                    setEnabled(false)
                                }
                            }}
                        /></Td>
                    </Tr>
                    <Tr>
                        <Td>Retries per day</Td>
                        <Td></Td>
                        <Td></Td>
                        <Td><Input
                            type="number"
                            id="retries"
                            value={retries}
                            min="0"
                            onChange={e => {
                                setRetries(e.currentTarget.value)
                            }}
                        /></Td>
                    </Tr>
                    <Tr>
                        <Td>Retries per week</Td>
                        <Td></Td>
                        <Td></Td>
                        <Td><Input
                            type="number"
                            id="retriesWeek"
                            value={retriesWeek}
                            min="0"
                            onChange={e => {
                                setRetriesWeek(e.currentTarget.value)
                            }}
                        /></Td>
                    </Tr>

                    <Tr><Td>Minutes Between Retires (Busy Signal)</Td>
                        <Td></Td>
                        <Td></Td>
                        <Td><Input
                            type="number"
                            id="intervalBusy"
                            value={intervalBusy}
                            min="0"
                            step="15"
                            onChange={e => {
                                setIntervalBusy(e.currentTarget.value)
                            }}
                        /></Td>
                    </Tr>
                    <Tr><Td>Minutes Between Retires (Answering Machine)</Td>
                        <Td></Td>
                        <Td></Td>
                        <Td><Input
                            type="number"
                            id="intervalAM"
                            value={intervalAM}
                            min="0"
                            step="15"
                            onChange={e => {
                                setIntervalAM(e.currentTarget.value)
                            }}
                        /></Td>
                    </Tr>
                    <Tr><Td>Minutes Between Retires (No Answer)</Td>
                        <Td></Td>
                        <Td></Td>
                        <Td><Input
                            type="number"
                            id="intervalNOAN"
                            value={intervalNOAN}
                            min="0"
                            step="15"
                            onChange={e => {
                                setIntervalNOAN(e.currentTarget.value)
                            }}
                        /></Td>
                    </Tr>
                    <Tr>
                        <Td>Minimum Ring Duration (in Seconds)</Td>
                        <Td></Td>
                        <Td></Td>
                        <Td><Input
                            type="number"
                            id="duration"
                            value={duration}
                            min="0"
                            step="6"
                            onChange={e => {
                                setDuration(e.currentTarget.value)
                            }}
                        /></Td>
                    </Tr>
                    <Tr>
                        <Td>Mulriple Schedules</Td>
                        <Td></Td>
                        <Td></Td>
                        <Td><Combobox
                            items={["True", "False"]}
                            value={multiTimes}
                            onInputValueChange={({ inputValue }) => {
                                if (inputValue === "True") {
                                    setMultiTimes(true)
                                } else {
                                    setMultiTimes(false)
                                }
                            }}
                        /></Td>
                    </Tr>
                    <Tr>
                        <Td>Caller Id</Td>
                        <Td></Td>
                        <Td></Td>
                        <Td><Combobox
                            items={["+6586115961", "+6589135961"]}
                            value={callerId}
                            onInputValueChange={({ inputValue }) => {
                                setCallerId(inputValue)
                            }}
                        /></Td>
                    </Tr>
                    <Tr>
                        <Td>Do Not Call List</Td>
                        <Td></Td>
                        <Td></Td>
                        <Td><Combobox
                            //items={["Global", "Sales", "Collections"]}
                            value={dnd}
                            onInputValueChange={({ inputValue }) => {
                                setDND(inputValue)
                            }}
                        /></Td>
                    </Tr>
                    <Tr>
                        <Td>Time Zone</Td>
                        <Td></Td>
                        <Td></Td>
                        <Td><Combobox
                            items={timezones}
                            value={tz}
                            onInputValueChange={({ inputValue }) => {
                                setTZ(inputValue)
                            }}/>
                        </Td>
                    </Tr>
                    <Tr>
                        <Td>Start Date</Td>
                        <Td><DatePicker required id="start" value={start} aria-describedby="start" onChange={(evt) => setStart(evt.target.value)} />
                        </Td>
                        <Td>End Date</Td>
                        <Td><DatePicker required id="end" value={end} aria-describedby="end" onChange={(evt) => setEnd(evt.target.value)} />
                        </Td>
                    </Tr>
                </TBody>
                <TFoot>
                    <Tr>
                        <Td></Td>
                        <Td></Td>
                        <Td></Td>
                        <Td align='center'><Button variant="primary" onClick={saveRules}>Save</Button>
                        </Td>
                    </Tr>
                </TFoot>
            </Table> : null}
            <br />

            <Toaster left={['space180', 'unset', 'unset']} {...toaster} />
        </div>
    )
};