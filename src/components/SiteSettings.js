import { Combobox } from '@twilio-paste/core/combobox';
import React, { useEffect } from 'react';
import { useToaster, Toaster } from '@twilio-paste/core/toast';
import axios from 'axios';
import { Input } from '@twilio-paste/core/input';
import { Heading } from '@twilio-paste/core/heading';
import { Button } from '@twilio-paste/core/button';
import { Table, THead, Tr, Td, Th, TBody, TFoot } from '@twilio-paste/core/table';
import { Label } from '@twilio-paste/core';
import { DatePicker } from '@twilio-paste/core/date-picker';
import { Modal, ModalBody, ModalFooter, ModalFooterActions, ModalHeader, ModalHeading } from '@twilio-paste/core/modal';
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
    const [isModalOpen, setModalOpen] = React.useState(false);
    const toaster = useToaster();
    const [allowUpdate, setAllowUpdate] = React.useState(true);

    const saveRules = () => {
        if (!retries) {
            setAllowUpdate(false)
            toaster.push({
                message: 'Set Retries per Day first',
                variant: 'error',
                dismissAfter: 3000
            })
        }
        if (!retriesWeek) {
            setAllowUpdate(false)
            toaster.push({
                message: 'Set Retries per Week first',
                variant: 'error',
                dismissAfter: 3000
            })
        }
        if (!intervalBusy) {
            setAllowUpdate(false)
            toaster.push({
                message: 'Set Time Between Retries first',
                variant: 'error',
                dismissAfter: 3000
            })
        }
        if (!duration) {
            setAllowUpdate(false)
            toaster.push({
                message: 'Set Minimum Ring Duration first',
                variant: 'error',
                dismissAfter: 3000
            })
        }
        if (!callerId) {
            setAllowUpdate(false)
            toaster.push({
                message: 'Set Caller Id first',
                variant: 'error',
                dismissAfter: 3000
            })
        }
        if (!dnd) {
            setAllowUpdate(false)
            toaster.push({
                message: 'Set Do Not Call List first',
                variant: 'error',
                dismissAfter: 3000
            })
        }
        if (!start) {
            setAllowUpdate(false)
            toaster.push({
                message: 'Set Start Date first',
                variant: 'error',
                dismissAfter: 3000
            })
        }
        if (!end) {
            setAllowUpdate(false)
            toaster.push({
                message: 'Set End Date first',
                variant: 'error',
                dismissAfter: 3000
            })
        }
        if (allowUpdate) {
            let updateData = JSON.stringify({
                "TableName": "OutboundRules",
                "Key": {
                    "campaign": {
                        "S": siteCampaign
                    }
                },
                "UpdateExpression": "set intervalNOAN = :intervalNOAN, intervalAM = :intervalAM, callerId = :callerId, dnd = :dnd, callduration = :callduration, enabled = :enabled, scheduleend = :scheduleend, scheduleinterval = :scheduleinterval, intervalBusy = :intervalBusy, retriesWeek = :retriesWeek, retry = :retry, schedulestart = :schedulestart, scheduletimezone = :scheduletimezone",
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
                        "S": enabled
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
                    ":intervalAM": {
                        "S": intervalAM
                    },
                    ":intervalNOAN": {
                        "S": intervalNOAN
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
                url: `${process.env.REACT_APP_URL}/updateItem`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: updateData
            };

            axios.request(updateConfig)
                .then((response) => {
                    console.log(JSON.stringify(response.data));
                    toaster.push({
                        message: 'Campaign Saved',
                        variant: 'success',
                        dismissAfter: 3000
                    })
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }

    const AddCampaignModal = (prop) => {
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
                    message: 'Campaign Name already Exists',
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
                let makeData = JSON.stringify({
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
                    url: `${process.env.REACT_APP_URL}/createTable`,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: makeData
                };

                axios.request(config)
                    .then((response) => {
                        toaster.push({
                            message: 'Campaign Created',
                            variant: 'success',
                            dismissAfter: 3000
                        })
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
                    "TableName": `${listName}-Campaign`,
                    "KeySchema": [
                        {
                            "AttributeName": "phoneNumber",
                            "KeyType": "HASH"
                        }
                    ],
                    "ProvisionedThroughput": {
                        "ReadCapacityUnits": 5,
                        "WriteCapacityUnits": 5
                    }
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
        let deleteData = JSON.stringify({
            "TableName": "OutboundRules",
            "Key": {
                "campaign": {
                    "S": siteCampaign
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
                toaster.push({
                    message: 'Campaign Deleted',
                    variant: 'success',
                    dismissAfter: 3000
                })
            })
            .catch((error) => {
                console.log(error);
            });
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
        let getNumbersData = JSON.stringify({});

        config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${process.env.REACT_APP_URL}/getNumbers`,
            headers: {},
            data: getNumbersData
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

        let dndData = JSON.stringify({
            "TableName": "DND"
        });
        let dndConfig = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${process.env.REACT_APP_URL}/scanTable`,
            headers: {},
            data: dndData
        };
        axios.request(dndConfig)
            .then((response) => {
                let dndToUse = []
                let dndList = response.data.items
                for (let i = 0; i < dndList.length; i++) {
                    dndToUse.push(dndList[i].name)
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
                                            setRetries(dynamoCampaigns[i].retry)
                                            setRetriesWeek(dynamoCampaigns[i].retriesWeek)
                                            setIntervalBusy(dynamoCampaigns[i].intervalBusy)
                                            setIntervalAM(dynamoCampaigns[i].intervalAM)
                                            setIntervalNOAN(dynamoCampaigns[i].intervalNOAN)
                                            setDuration(dynamoCampaigns[i].callduration)
                                            setCallerId(dynamoCampaigns[i].callerId)
                                            setDND(dynamoCampaigns[i].dnd)
                                            setStart(dynamoCampaigns[i].schedulestart)
                                            setEnd(dynamoCampaigns[i].scheduleend)
                                            setEnabled(dynamoCampaigns[i].enabled)
                                            setTZ(dynamoCampaigns[i].scheduletimezone)
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
                                    setEnabled("true")
                                } else {
                                    setEnabled("false")
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