import { Combobox } from '@twilio-paste/core/combobox';
import React, { useEffect } from 'react';
import { useToaster, Toaster } from '@twilio-paste/core/toast';
import axios from 'axios';
import { Input } from '@twilio-paste/core/input';
import { Heading } from '@twilio-paste/core/heading';
import { Button } from '@twilio-paste/core/button';
import { Table, THead, Tr, Td, Th, TBody, TFoot } from '@twilio-paste/core/table';
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
    const [numbers, setNumbers] = React.useState([]);
    const [dndList, setDNDList] = React.useState([]);
    const [dnd, setDND] = React.useState();
    const [tz, setTZ] = React.useState("Asia/Singapore");
    const [start, setStart] = React.useState('');
    const [end, setEnd] = React.useState('');
    const [updateCamapign, setUpdateCampaign] = React.useState(true);
    const [selectedCampaign, setSelectedCampaign] = React.useState(false);
    const [dynamoCampaigns, setDynamoCampaigns] = React.useState([]);
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

        let data = JSON.stringify({
            "TableName": "OutboundRules",
            "Key": {
                "campaign": {
                    "S": siteCampaign
                }
            },
            "UpdateExpression": "set callerId = :callerId, dnd = :dnd, callduration = :callduration, enabled = :enabled, scheduleend = :scheduleend, scheduleinterval = :scheduleinterval, intervalBusy = :intervalBusy, retriesWeek = :retriesWeek, retry = :retry, schedulestart = :schedulestart, scheduletimezone = :scheduletimezone",
            "ConditionExpression": "campaign = :campaign",
            "ExpressionAttributeValues": {
                ":campaign": {
                    "S": siteCampaign
                },
                ":callerId": {
                    "S": callerId
                },
                ":dnd": {
                    "S": dnd
                },
                ":callduration": {
                    "S": duration
                },
                ":enabled": {
                    "BOOL": enabled
                },
                ":scheduleend": {
                    "S": end
                },
                ":scheduleinterval": {
                    "S": "500"
                },
                ":intervalBusy": {
                    "S": intervalBusy
                },
                ":retriesWeek": {
                    "S": retriesWeek
                },
                ":retry": {
                    "S": retries
                },
                ":schedulestart": {
                    "S": start
                },
                ":scheduletimezone": {
                    "S": tz
                }
            }
        });

        let updateConfig = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://lj3qlnw0qh.execute-api.ap-southeast-1.amazonaws.com/connect-outbound/updateSettings',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };
        console.log(updateConfig)

        axios.request(updateConfig)
            .then((response) => {
                console.log(JSON.stringify(response.data));
            })
            .catch((error) => {
                console.log(error);
            });

        /*
        
                if (updateCamapign === false) {
                    let updates = {};
                    updates.campaign = siteCampaign;
                    updates.retry = retries;
                    updates.duration = duration;
                    updates.intervalBusy = intervalBusy;
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
                            dynamoCampaigns[i].intervalBusy = intervalBusy;
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
                }*/
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
                setUpdateCampaign(false);
                let data = JSON.stringify({
                    "TableName": "OutboundRules",
                    "Item": {
                        "campaign": {
                            "S": listName
                        }
                    }
                });

                let config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: 'https://lj3qlnw0qh.execute-api.ap-southeast-1.amazonaws.com/connect-outbound/makeSettings',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: data
                };

                axios.request(config)
                    .then((response) => {
                        console.log(JSON.stringify(response.data));
                    })
                    .catch((error) => {
                        console.log(error);
                    });




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
        /*if(siteCampaign.length === 0){
            toaster.push({
                message: 'Select List First',
                variant: 'error',
                dismissAfter: 3000
            })
        }*/
        let campaignToUpdate = []
        let newCampaign = []
        for (let i = 0; i < dynamoCampaigns.length; i++) {
            if (dynamoCampaigns[i].campaign === siteCampaign) {
                console.log(siteCampaign, "found", i)
            } else {
                campaignToUpdate.push(dynamoCampaigns[i])
                newCampaign.push(dynamoCampaigns[i].campaign)
            }
        }

        setCampaign(newCampaign);
        setSiteCampaign([])
        setSelectedCampaign(false)
        setDynamoCampaigns(campaignToUpdate)
        localStorage.setItem('campaigns', JSON.stringify(campaignToUpdate));
    }

    useEffect(() => {
        let currentCampaigns = [];

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${process.env.REACT_APP_URL}/readSettings`,
            headers: {}
        };
        console.log(config)
        axios.request(config)
            .then((response) => {
                let items = response.data.items
                setDynamoCampaigns(items)
                for (let i = 0; i < items.length; i++) {
                    currentCampaigns.push(items[i].campaign)
                }
                setCampaign(currentCampaigns);
                console.log(`Campaign(s) are: ${currentCampaigns}`)
            })
            .catch((error) => {
                console.log(error);
            });
        let data = JSON.stringify({});

        config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${process.env.REACT_APP_URL}/getNumbers`,
            headers: {},
            data: data
        };
        axios.request(config)
            .then((response) => {
                console.log(response)
                let numToUse = []
                let numList = response.data.ListPhoneNumbersSummaryList
                for (let i = 0; i < numList.length; i++) {
                    numToUse.push(numList[i].PhoneNumber)
                }
                setNumbers(numToUse)
            })
            .catch((error) => {
                console.log(error);
            });
        setCampaign(currentCampaigns);
        console.log(`Campaign(s) are: ${currentCampaigns}`)

        config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${process.env.REACT_APP_URL}/getDND`,
            headers: {}
        };
        console.log(config)
        axios.request(config)
            .then((response) => {
                let dndToUse = []
                let dndList = response.data.Items
                for (let i = 0; i < dndList.length; i++) {
                    dndToUse.push(dndList[i].name.S)
                }
                setDNDList(dndToUse)

            })
            .catch((error) => {
                console.log(error);
            });

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
                        <Td>Caller Id</Td>
                        <Td></Td>
                        <Td></Td>
                        <Td><Combobox
                            items={numbers}
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
                            items={dndList}
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
                            }} />
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