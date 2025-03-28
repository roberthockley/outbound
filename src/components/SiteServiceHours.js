import { Combobox } from '@twilio-paste/core/combobox';
import React, { useEffect } from 'react';
import { useToaster, Toaster } from '@twilio-paste/core/toast';
import axios from 'axios';
import { Heading } from '@twilio-paste/core/heading';
import { Button } from '@twilio-paste/core/button';
import { Table, THead, Tr, Td, Th, TBody, TFoot } from '@twilio-paste/core/table';
import { TimePicker } from '@twilio-paste/core/time-picker';
import { Checkbox, HelpText } from '@twilio-paste/core';
import { Label } from '@twilio-paste/core';
import { Modal, ModalBody, ModalFooter, ModalFooterActions, ModalHeader, ModalHeading } from '@twilio-paste/core/modal';
import { useUID } from '@twilio-paste/core/uid-library';
import { Input } from '@twilio-paste/core/input';



let newData = []
let dynamoHours;

export const SiteServiceHours = () => {
    const [schedule, setSchedule] = React.useState(newData);
    const [siteSchedule, setSiteSchedule] = React.useState(newData);
    const [showTimes, setShowTimes] = React.useState(false);
    const [multiTimes, setMultiTimes] = React.useState(false);
    const [mondayStart1, setMondayStart1] = React.useState("09:00:00");
    const [mondayEnd1, setMondayEnd1] = React.useState("17:00:00");
    const [mondayChecked, setMondayChecked] = React.useState(false);
    const [mondayHelp1, setMondayHelp1] = React.useState(false);
    const [tuesdayStart1, setTuesdayStart1] = React.useState("09:00:00");
    const [tuesdayEnd1, setTuesdayEnd1] = React.useState("17:00:00");
    const [tuesdayChecked, setTuesdayChecked] = React.useState(false);
    const [tuesdayHelp1, setTuesdayHelp1] = React.useState(false);
    const [wednesdayStart1, setWednesdayStart1] = React.useState("09:00:00");
    const [wednesdayEnd1, setWednesdayEnd1] = React.useState("17:00:00");
    const [wednesdayChecked, setWednesdayChecked] = React.useState(false);
    const [wednesdayHelp1, setWednesdayHelp1] = React.useState(false);
    const [thursdayStart1, setThursdayStart1] = React.useState("09:00:00");
    const [thursdayEnd1, setThursdayEnd1] = React.useState("17:00:00");
    const [thursdayChecked, setThursdayChecked] = React.useState(false);
    const [thursdayHelp1, setThursdayHelp1] = React.useState(false);
    const [fridayStart1, setFridayStart1] = React.useState("09:00:00");
    const [fridayEnd1, setFridayEnd1] = React.useState("17:00:00");
    const [fridayChecked, setFridayChecked] = React.useState(false);
    const [fridayHelp1, setFridayHelp1] = React.useState(false);
    const [saturdayStart1, setSaturdayStart1] = React.useState("09:00:00");
    const [saturdayEnd1, setSaturdayEnd1] = React.useState("17:00:00");
    const [saturdayChecked, setSaturdayChecked] = React.useState(false);
    const [saturdayHelp1, setSaturdayHelp1] = React.useState(false);
    const [sundayStart1, setSundayStart1] = React.useState("09:00:00");
    const [sundayEnd1, setSundayEnd1] = React.useState("17:00:00");
    const [sundayChecked, setSundayChecked] = React.useState(false);
    const [sundayHelp1, setSundayHelp1] = React.useState(false);
    const [mondayStart2, setMondayStart2] = React.useState("22:00:00");
    const [mondayEnd2, setMondayEnd2] = React.useState("23:00:00");
    const [mondayHelp2, setMondayHelp2] = React.useState(false);
    const [tuesdayStart2, setTuesdayStart2] = React.useState("22:00:00");
    const [tuesdayEnd2, setTuesdayEnd2] = React.useState("23:00:00");
    const [tuesdayHelp2, setTuesdayHelp2] = React.useState(false);
    const [wednesdayStart2, setWednesdayStart2] = React.useState("22:00:00");
    const [wednesdayEnd2, setWednesdayEnd2] = React.useState("23:00:00");
    const [wednesdayHelp2, setWednesdayHelp2] = React.useState(false);
    const [thursdayStart2, setThursdayStart2] = React.useState("22:00:00");
    const [thursdayEnd2, setThursdayEnd2] = React.useState("23:00:00");
    const [thursdayHelp2, setThursdayHelp2] = React.useState(false);
    const [fridayStart2, setFridayStart2] = React.useState("22:00:00");
    const [fridayEnd2, setFridayEnd2] = React.useState("23:00:00");
    const [fridayHelp2, setFridayHelp2] = React.useState(false);
    const [saturdayStart2, setSaturdayStart2] = React.useState("22:00:00");
    const [saturdayEnd2, setSaturdayEnd2] = React.useState("23:00:00");
    const [saturdayHelp2, setSaturdayHelp2] = React.useState(false);
    const [sundayStart2, setSundayStart2] = React.useState("22:00:00");
    const [sundayEnd2, setSundayEnd2] = React.useState("23:00:00");
    const [sundayHelp2, setSundayHelp2] = React.useState(false);
    const [mondayHelp3, setMondayHelp3] = React.useState(false);
    const [tuesdayHelp3, setTuesdayHelp3] = React.useState(false);
    const [wednesdayHelp3, setWednesdayHelp3] = React.useState(false);
    const [thursdayHelp3, setThursdayHelp3] = React.useState(false);
    const [fridayHelp3, setFridayHelp3] = React.useState(false);
    const [saturdayHelp3, setSaturdayHelp3] = React.useState(false);
    const [sundayHelp3, setSundayHelp3] = React.useState(false);
    const [dynamoHours, setDynamoHours] = React.useState("");
    const [isModalOpen, setModalOpen] = React.useState(true);
    const [savedSettings, setSavedSettings] = React.useState(true);
    const [comboboxKey, setComboboxKey] = React.useState(0);

    const toaster = useToaster();

    const getHours = (site) => {
        setShowTimes(true)
        for (let i = 0; i < dynamoHours.length; i++) {
            if (dynamoHours[i].campaign === site) {
                if (dynamoHours[i].shift === "true") {
                    setMultiTimes(true)
                    if (dynamoHours[i].shift === "true") {
                        setMultiTimes(true)
                    } else {
                        setMultiTimes(false)
                    }
                    let timesToUse = dynamoHours[i].hours
                    if (timesToUse.Start1.Monday === "Closed") {
                        setMondayStart1("00:00:00")
                        setMondayStart2("00:00:00")
                        setMondayEnd1("00:00:00")
                        setMondayEnd2("00:00:00")
                        setMondayChecked(true)
                    } else {
                        if (timesToUse.Start1.Monday.slice(0, 2) >= timesToUse.End1.Monday.slice(0, 2)) {
                            setMondayHelp1(true)
                        }
                        if (timesToUse.Start2.Monday.slice(0, 2) <= timesToUse.End1.Monday.slice(0, 2)) {
                            setMondayHelp2(true)
                        }
                        if (timesToUse.Start2.Monday.slice(0, 2) >= timesToUse.End2.Monday.slice(0, 2)) {
                            setMondayHelp3(true)
                        }
                        setMondayStart1(timesToUse.Start1.Monday)
                        setMondayStart2(timesToUse.Start2.Monday)
                        setMondayEnd1(timesToUse.End1.Monday)
                        setMondayEnd2(timesToUse.End2.Monday)
                        setMondayChecked(false)
                    }
                    if (timesToUse.Start1.Tuesday === "Closed") {
                        setTuesdayStart1("00:00:00")
                        setTuesdayStart2("00:00:00")
                        setTuesdayEnd1("00:00:00")
                        setTuesdayEnd2("00:00:00")
                        setTuesdayChecked(true)
                    } else {
                        if (timesToUse.Start1.Tuesday.slice(0, 2) >= timesToUse.End1.Tuesday.slice(0, 2)) {
                            setTuesdayHelp1(true)
                        }
                        if (timesToUse.Start2.Tuesday.slice(0, 2) <= timesToUse.End1.Tuesday.slice(0, 2)) {
                            setTuesdayHelp2(true)
                        }
                        if (timesToUse.Start2.Tuesday.slice(0, 2) >= timesToUse.End2.Tuesday.slice(0, 2)) {
                            setTuesdayHelp3(true)
                        }
                        setTuesdayStart1(timesToUse.Start1.Tuesday)
                        setTuesdayStart2(timesToUse.Start2.Tuesday)
                        setTuesdayEnd1(timesToUse.End1.Tuesday)
                        setTuesdayEnd2(timesToUse.End2.Tuesday)
                        setTuesdayChecked(false)
                    }
                    if (timesToUse.Start1.Wednesday === "Closed") {
                        setWednesdayStart1("00:00:00")
                        setWednesdayStart2("00:00:00")
                        setWednesdayEnd1("00:00:00")
                        setWednesdayEnd2("00:00:00")
                        setWednesdayChecked(true)
                    } else {
                        if (timesToUse.Start1.Wednesday.slice(0, 2) >= timesToUse.End1.Wednesday.slice(0, 2)) {
                            setWednesdayHelp1(true)
                        }
                        if (timesToUse.Start2.Wednesday.slice(0, 2) <= timesToUse.End1.Wednesday.slice(0, 2)) {
                            setWednesdayHelp2(true)
                        }
                        if (timesToUse.Start2.Wednesday.slice(0, 2) >= timesToUse.End2.Wednesday.slice(0, 2)) {
                            setWednesdayHelp3(true)
                        }
                        setWednesdayStart1(timesToUse.Start1.Wednesday)
                        setWednesdayStart2(timesToUse.Start2.Wednesday)
                        setWednesdayEnd1(timesToUse.End1.Wednesday)
                        setWednesdayEnd2(timesToUse.End2.Wednesday)
                        setWednesdayChecked(false)
                    }
                    if (timesToUse.Start1.Thursday === "Closed") {
                        setThursdayStart1("00:00:00")
                        setThursdayStart2("00:00:00")
                        setThursdayEnd1("00:00:00")
                        setThursdayEnd2("00:00:00")
                        setThursdayChecked(true)
                    } else {
                        if (timesToUse.Start1.Thursday.slice(0, 2) >= timesToUse.End1.Thursday.slice(0, 2)) {
                            setThursdayHelp1(true)
                        }
                        if (timesToUse.Start2.Thursday.slice(0, 2) <= timesToUse.End1.Thursday.slice(0, 2)) {
                            setThursdayHelp2(true)
                        }
                        if (timesToUse.Start2.Thursday.slice(0, 2) >= timesToUse.End2.Thursday.slice(0, 2)) {
                            setThursdayHelp3(true)
                        }
                        setThursdayStart1(timesToUse.Start1.Thursday)
                        setThursdayStart2(timesToUse.Start2.Thursday)
                        setThursdayEnd1(timesToUse.End1.Thursday)
                        setThursdayEnd2(timesToUse.End2.Thursday)
                        setThursdayChecked(false)
                    }
                    if (timesToUse.Start1.Friday === "Closed") {
                        setFridayStart1("00:00:00")
                        setFridayStart2("00:00:00")
                        setFridayEnd1("00:00:00")
                        setFridayEnd2("00:00:00")
                        setFridayChecked(true)
                    } else {
                        if (timesToUse.Start1.Friday.slice(0, 2) >= timesToUse.End1.Friday.slice(0, 2)) {
                            setFridayHelp1(true)
                        }
                        if (timesToUse.Start2.Friday.slice(0, 2) <= timesToUse.End1.Friday.slice(0, 2)) {
                            setFridayHelp2(true)
                        }
                        if (timesToUse.Start2.Friday.slice(0, 2) >= timesToUse.End2.Friday.slice(0, 2)) {
                            setFridayHelp3(true)
                        }
                        setFridayStart1(timesToUse.Start1.Friday)
                        setFridayStart2(timesToUse.Start2.Friday)
                        setFridayEnd1(timesToUse.End1.Friday)
                        setFridayEnd2(timesToUse.End2.Friday)
                        setFridayChecked(false)
                    }
                    if (timesToUse.Start1.Saturday === "Closed") {
                        setSaturdayStart1("00:00:00")
                        setSaturdayStart2("00:00:00")
                        setSaturdayEnd1("00:00:00")
                        setSaturdayEnd2("00:00:00")
                        setSaturdayChecked(true)
                    } else {
                        if (timesToUse.Start1.Saturday.slice(0, 2) >= timesToUse.End1.Saturday.slice(0, 2)) {
                            setSaturdayHelp1(true)
                        }
                        if (timesToUse.Start2.Saturday.slice(0, 2) <= timesToUse.End1.Saturday.slice(0, 2)) {
                            setSaturdayHelp2(true)
                        }
                        if (timesToUse.Start2.Saturday.slice(0, 2) >= timesToUse.End2.Saturday.slice(0, 2)) {
                            setSaturdayHelp3(true)
                        }
                        setSaturdayStart1(timesToUse.Start1.Saturday)
                        setSaturdayStart2(timesToUse.Start2.Saturday)
                        setSaturdayEnd1(timesToUse.End1.Saturday)
                        setSaturdayEnd2(timesToUse.End2.Saturday)
                        setSaturdayChecked(false)
                    }
                    if (timesToUse.Start1.Sunday === "Closed") {
                        setSundayStart1("00:00:00")
                        setSundayStart2("00:00:00")
                        setSundayEnd1("00:00:00")
                        setSundayEnd2("00:00:00")
                        setSundayChecked(true)
                    } else {
                        if (timesToUse.Start1.Sunday.slice(0, 2) >= timesToUse.End1.Sunday.slice(0, 2)) {
                            setSundayHelp1(true)
                        }
                        if (timesToUse.Start2.Sunday.slice(0, 2) <= timesToUse.End1.Sunday.slice(0, 2)) {
                            setSundayHelp2(true)
                        }
                        if (timesToUse.Start2.Sunday.slice(0, 2) >= timesToUse.End2.Sunday.slice(0, 2)) {
                            setSundayHelp3(true)
                        }
                        setSundayStart1(timesToUse.Start1.Sunday)
                        setSundayStart2(timesToUse.Start2.Sunday)
                        setSundayEnd1(timesToUse.End1.Sunday)
                        setSundayEnd2(timesToUse.End2.Sunday)
                        setSundayChecked(false)
                    }
                } else {
                    setMultiTimes(false)
                    if (dynamoHours[i].shift === "true") {
                        setMultiTimes(true)
                    } else {
                        setMultiTimes(false)
                    }
                    let timesToUse = dynamoHours[i].hours
                    if (timesToUse.Start1.Monday === "Closed") {
                        setMondayStart1("00:00:00")
                        setMondayStart2("00:00:00")
                        setMondayEnd1("00:00:00")
                        setMondayEnd2("00:00:00")
                        setMondayChecked(true)
                    } else {
                        if (timesToUse.Start1.Monday.slice(0, 2) >= timesToUse.End1.Monday.slice(0, 2)) {
                            setMondayHelp1(true)
                        }
                        if (timesToUse.Start2.Monday.slice(0, 2) <= timesToUse.End1.Monday.slice(0, 2)) {
                            setMondayHelp2(true)
                        }
                        setMondayStart1(timesToUse.Start1.Monday)
                        setMondayStart2(timesToUse.Start2.Monday)
                        setMondayEnd1(timesToUse.End1.Monday)
                        setMondayEnd2(timesToUse.End2.Monday)
                        setMondayChecked(false)
                    }
                    if (timesToUse.Start1.Tuesday === "Closed") {
                        setTuesdayStart1("00:00:00")
                        setTuesdayStart2("00:00:00")
                        setTuesdayEnd1("00:00:00")
                        setTuesdayEnd2("00:00:00")
                        setTuesdayChecked(true)
                    } else {
                        if (timesToUse.Start1.Tuesday.slice(0, 2) >= timesToUse.End1.Tuesday.slice(0, 2)) {
                            setTuesdayHelp1(true)
                        }
                        if (timesToUse.Start2.Tuesday.slice(0, 2) <= timesToUse.End1.Tuesday.slice(0, 2)) {
                            setTuesdayHelp2(true)
                        }
                        setTuesdayStart1(timesToUse.Start1.Tuesday)
                        setTuesdayStart2(timesToUse.Start2.Tuesday)
                        setTuesdayEnd1(timesToUse.End1.Tuesday)
                        setTuesdayEnd2(timesToUse.End2.Tuesday)
                        setTuesdayChecked(false)
                    }
                    if (timesToUse.Start1.Wednesday === "Closed") {
                        setWednesdayStart1("00:00:00")
                        setWednesdayStart2("00:00:00")
                        setWednesdayEnd1("00:00:00")
                        setWednesdayEnd2("00:00:00")
                        setWednesdayChecked(true)
                    } else {
                        if (timesToUse.Start1.Wednesday.slice(0, 2) >= timesToUse.End1.Wednesday.slice(0, 2)) {
                            setWednesdayHelp1(true)
                        }
                        if (timesToUse.Start2.Wednesday.slice(0, 2) <= timesToUse.End1.Wednesday.slice(0, 2)) {
                            setWednesdayHelp2(true)
                        }
                        setWednesdayStart1(timesToUse.Start1.Wednesday)
                        setWednesdayStart2(timesToUse.Start2.Wednesday)
                        setWednesdayEnd1(timesToUse.End1.Wednesday)
                        setWednesdayEnd2(timesToUse.End2.Wednesday)
                        setWednesdayChecked(false)
                    }
                    if (timesToUse.Start1.Thursday === "Closed") {
                        setThursdayStart1("00:00:00")
                        setThursdayStart2("00:00:00")
                        setThursdayEnd1("00:00:00")
                        setThursdayEnd2("00:00:00")
                        setThursdayChecked(true)
                    } else {
                        if (timesToUse.Start1.Thursday.slice(0, 2) >= timesToUse.End1.Thursday.slice(0, 2)) {
                            setThursdayHelp1(true)
                        }
                        if (timesToUse.Start2.Thursday.slice(0, 2) <= timesToUse.End1.Thursday.slice(0, 2)) {
                            setThursdayHelp2(true)
                        }
                        setThursdayStart1(timesToUse.Start1.Thursday)
                        setThursdayStart2(timesToUse.Start2.Thursday)
                        setThursdayEnd1(timesToUse.End1.Thursday)
                        setThursdayEnd2(timesToUse.End2.Thursday)
                        setThursdayChecked(false)
                    }
                    if (timesToUse.Start1.Friday === "Closed") {
                        setFridayStart1("00:00:00")
                        setFridayStart2("00:00:00")
                        setFridayEnd1("00:00:00")
                        setFridayEnd2("00:00:00")
                        setFridayChecked(true)
                    } else {
                        if (timesToUse.Start1.Friday.slice(0, 2) >= timesToUse.End1.Friday.slice(0, 2)) {
                            setFridayHelp1(true)
                        }
                        if (timesToUse.Start2.Friday.slice(0, 2) <= timesToUse.End1.Friday.slice(0, 2)) {
                            setFridayHelp2(true)
                        }
                        setFridayStart1(timesToUse.Start1.Friday)
                        setFridayStart2(timesToUse.Start2.Friday)
                        setFridayEnd1(timesToUse.End1.Friday)
                        setFridayEnd2(timesToUse.End2.Friday)
                        setFridayChecked(false)
                    }
                    if (timesToUse.Start1.Saturday === "Closed") {
                        setSaturdayStart1("00:00:00")
                        setSaturdayStart2("00:00:00")
                        setSaturdayEnd1("00:00:00")
                        setSaturdayEnd2("00:00:00")
                        setSaturdayChecked(true)
                    } else {
                        if (timesToUse.Start1.Saturday.slice(0, 2) >= timesToUse.End1.Saturday.slice(0, 2)) {
                            setSaturdayHelp1(true)
                        }
                        if (timesToUse.Start2.Saturday.slice(0, 2) <= timesToUse.End1.Saturday.slice(0, 2)) {
                            setSaturdayHelp2(true)
                        }
                        setSaturdayStart1(timesToUse.Start1.Saturday)
                        setSaturdayStart2(timesToUse.Start2.Saturday)
                        setSaturdayEnd1(timesToUse.End1.Saturday)
                        setSaturdayEnd2(timesToUse.End2.Saturday)
                        setSaturdayChecked(false)
                    }
                    if (timesToUse.Start1.Sunday === "Closed") {
                        setSundayStart1("00:00:00")
                        setSundayStart2("00:00:00")
                        setSundayEnd1("00:00:00")
                        setSundayEnd2("00:00:00")
                        setSundayChecked(true)
                    } else {
                        if (timesToUse.Start1.Sunday.slice(0, 2) >= timesToUse.End1.Sunday.slice(0, 2)) {
                            setSundayHelp1(true)
                        }
                        if (timesToUse.Start2.Sunday.slice(0, 2) <= timesToUse.End1.Sunday.slice(0, 2)) {
                            setSundayHelp2(true)
                        }

                        setSundayStart1(timesToUse.Start1.Sunday)
                        setSundayStart2(timesToUse.Start2.Sunday)
                        setSundayEnd1(timesToUse.End1.Sunday)
                        setSundayEnd2(timesToUse.End2.Sunday)
                        setSundayChecked(false)
                    }
                }
            }
        }
        setComboboxKey(prevKey => prevKey + 1);
    }

    const saveTimes = () => {
        console.log(sundayHelp1, sundayHelp2, sundayHelp3)
        let save = true
        let dataStart1 = {}
        let dataEnd1 = {}
        let dataStart2 = {}
        let dataEnd2 = {}
        if (sundayHelp1 || sundayHelp2 || sundayHelp3) {
            toaster.push({
                message: 'Please fix Sunday',
                variant: 'error',
                dismissAfter: 3000
            })
            save = false
        }
        if (mondayHelp1 || mondayHelp2 || mondayHelp3) {
            toaster.push({
                message: 'Please fix Monday',
                variant: 'error',
                dismissAfter: 3000
            })
            save = false
        }
        if (tuesdayHelp1 || tuesdayHelp2 || tuesdayHelp3) {
            toaster.push({
                message: 'Please fix Tuesday',
                variant: 'error',
                dismissAfter: 3000
            })
            save = false
        }
        if (wednesdayHelp1 || wednesdayHelp2 || wednesdayHelp3) {
            toaster.push({
                message: 'Please fix Wednesday',
                variant: 'error',
                dismissAfter: 3000
            })
            save = false
        }
        if (thursdayHelp1 || thursdayHelp2 || thursdayHelp3) {
            toaster.push({
                message: 'Please fix Thursday',
                variant: 'error',
                dismissAfter: 3000
            })
            save = false
        }
        if (fridayHelp1 || fridayHelp2 || fridayHelp3) {
            toaster.push({
                message: 'Please fix Friday',
                variant: 'error',
                dismissAfter: 3000
            })
            save = false
        }
        if (saturdayHelp1 || saturdayHelp2 || saturdayHelp3) {
            toaster.push({
                message: 'Please fix Saturday',
                variant: 'error',
                dismissAfter: 3000
            })
            save = false
        }
        if (mondayChecked) {
            dataStart1.Monday = "Closed"
            dataStart2.Monday = "Closed"
            dataEnd1.Monday = "Closed"
            dataEnd2.Monday = "Closed"
        } else {
            dataStart1.Monday = mondayStart1
            dataStart2.Monday = mondayStart2
            dataEnd1.Monday = mondayEnd1
            dataEnd2.Monday = mondayEnd2
        }
        if (tuesdayChecked) {
            dataStart1.Tuesday = "Closed"
            dataStart2.Tuesday = "Closed"
            dataEnd1.Tuesday = "Closed"
            dataEnd2.Tuesday = "Closed"
        } else {
            dataStart1.Tuesday = tuesdayStart1
            dataStart2.Tuesday = tuesdayStart2
            dataEnd1.Tuesday = tuesdayEnd1
            dataEnd2.Tuesday = tuesdayEnd2
        }
        if (wednesdayChecked) {
            dataStart1.Wednesday = "Closed"
            dataStart2.Wednesday = "Closed"
            dataEnd1.Wednesday = "Closed"
            dataEnd2.Wednesday = "Closed"
        } else {
            dataStart1.Wednesday = wednesdayStart1
            dataStart2.Wednesday = wednesdayStart2
            dataEnd1.Wednesday = wednesdayEnd1
            dataEnd2.Wednesday = wednesdayEnd2
        }
        if (thursdayChecked) {
            dataStart1.Thursday = "Closed"
            dataStart2.Thursday = "Closed"
            dataEnd1.Thursday = "Closed"
            dataEnd2.Thursday = "Closed"
        } else {
            dataStart1.Thursday = thursdayStart1
            dataStart2.Thursday = thursdayStart2
            dataEnd1.Thursday = thursdayEnd1
            dataEnd2.Thursday = thursdayEnd2
        }
        if (fridayChecked) {
            dataStart1.Friday = "Closed"
            dataStart2.Friday = "Closed"
            dataEnd1.Friday = "Closed"
            dataEnd2.Friday = "Closed"
        } else {
            dataStart1.Friday = fridayStart1
            dataStart2.Friday = fridayStart2
            dataEnd1.Friday = fridayEnd1
            dataEnd2.Friday = fridayEnd2
        }
        if (saturdayChecked) {
            dataStart1.Saturday = "Closed"
            dataStart2.Saturday = "Closed"
            dataEnd1.Saturday = "Closed"
            dataEnd2.Saturday = "Closed"
        } else {
            dataStart1.Saturday = saturdayStart1
            dataStart2.Saturday = saturdayStart2
            dataEnd1.Saturday = saturdayEnd1
            dataEnd2.Saturday = saturdayEnd2
        }
        if (sundayChecked) {
            dataStart1.Sunday = "Closed"
            dataStart2.Sunday = "Closed"
            dataEnd1.Sunday = "Closed"
            dataEnd2.Sunday = "Closed"
        } else {
            dataStart1.Sunday = sundayStart1
            dataStart2.Sunday = sundayStart2
            dataEnd1.Sunday = sundayEnd1
            dataEnd2.Sunday = sundayEnd2
        }
        if (save === true) {
            let result = {}
            result.Start1 = dataStart1
            result.Start2 = dataStart2
            result.End1 = dataEnd1
            result.End2 = dataEnd2

            for (let i = 0; i < dynamoHours.length; i++) {
                if (dynamoHours[i].campaign === siteSchedule) {
                    dynamoHours[i].hours = result
                }
            }

            let updateData = JSON.stringify({
                "TableName": "Schedules",
                "Key": {
                    "campaign": {
                        "S": siteSchedule
                    }
                },
                UpdateExpression: "SET #hours = :hours, #shift = :shift",
                ExpressionAttributeNames: {
                    "#hours": "hours",
                    "#shift": "shift"
                },
                "ConditionExpression": "campaign = :campaign",
                ExpressionAttributeValues: {
                    ":campaign": {
                        "S": siteSchedule
                    },
                    ":hours": {
                        M: {
                            "End1": {
                                M: {
                                    "Friday": { S: dataEnd1.Friday },
                                    "Monday": { S: dataEnd1.Monday },
                                    "Saturday": { S: dataEnd1.Saturday },
                                    "Sunday": { S: dataEnd1.Sunday },
                                    "Thursday": { S: dataEnd1.Thursday },
                                    "Tuesday": { S: dataEnd1.Tuesday },
                                    "Wednesday": { S: dataEnd1.Wednesday }
                                }
                            },
                            "End2": {
                                M: {
                                    "Friday": { S: dataEnd2.Friday },
                                    "Monday": { S: dataEnd2.Monday },
                                    "Saturday": { S: dataEnd2.Saturday },
                                    "Sunday": { S: dataEnd2.Sunday },
                                    "Thursday": { S: dataEnd2.Thursday },
                                    "Tuesday": { S: dataEnd2.Tuesday },
                                    "Wednesday": { S: dataEnd2.Wednesday }
                                }
                            },
                            "Start1": {
                                M: {
                                    "Friday": { S: dataStart1.Friday },
                                    "Monday": { S: dataStart1.Monday },
                                    "Saturday": { S: dataStart1.Saturday },
                                    "Sunday": { S: dataStart1.Sunday },
                                    "Thursday": { S: dataStart1.Thursday },
                                    "Tuesday": { S: dataStart1.Tuesday },
                                    "Wednesday": { S: dataStart1.Wednesday }
                                }
                            },
                            "Start2": {
                                M: {
                                    "Friday": { S: dataStart2.Friday },
                                    "Monday": { S: dataStart2.Monday },
                                    "Saturday": { S: dataStart2.Saturday },
                                    "Sunday": { S: dataStart2.Sunday },
                                    "Thursday": { S: dataStart2.Thursday },
                                    "Tuesday": { S: dataStart2.Tuesday },
                                    "Wednesday": { S: dataStart2.Wednesday }
                                }
                            }
                        }
                    },
                    ":shift": { S: multiTimes.toString() }
                },
                ReturnValues: "UPDATED_NEW"

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
                    console.log(response)
                    setSavedSettings(true)
                    getHours(siteSchedule)
                    toaster.push({
                        message: 'Schedule Saved',
                        variant: 'success',
                        dismissAfter: 3000
                    })
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }

    const setShifts = () => {
        setMultiTimes(!multiTimes)
    }

    const AddScheduleModal = (prop) => {
        const [isOpen, setIsOpen] = React.useState(false);
        const modalHeadingID = useUID();
        const [listName, setListName] = React.useState('');
        if (!savedSettings) { } else {
            const handleOpen = () => {
                setIsOpen(true)
                console.log("Modal Open");
            }
            const handleClose = () => {
                setShowTimes(true)
                setIsOpen(false)
                console.log("Modal closed")
            };
            const addSchedule = () => {
                if (schedule.indexOf(listName) !== -1) {
                    console.log("-1")
                    toaster.push({
                        message: 'Campaign Name already Exists',
                        variant: 'error',
                        dismissAfter: 3000
                    })
                } else {
                    let updatedDrop = [...schedule]; // Create a new array
                    updatedDrop.push(listName); // Push the new campaign
                    setSchedule(updatedDrop); // Update state
                    let makeData = JSON.stringify({
                        "TableName": "Schedules",
                        "Item": {
                            "campaign": {
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
                            setSiteSchedule(listName)
                            setSavedSettings(false)
                            setComboboxKey(prevKey => prevKey + 1);
                            setTimeout(() => setShowTimes(true), 0); // Force re-render
                            toaster.push({
                                message: 'Schedule Created',
                                variant: 'success',
                                dismissAfter: 3000
                            })
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                }
            }
            return (
                <div>
                    <Button variant="primary" onClick={handleOpen}>
                        New Schedule
                    </Button>
                    <Modal ariaLabelledby={modalHeadingID} isOpen={isOpen} onDismiss={handleClose} size="default">
                        <ModalHeader>
                            <ModalHeading as="h3" id={modalHeadingID}>
                                New Schedule
                            </ModalHeading>
                        </ModalHeader>
                        <ModalBody>
                            <Label>Schedule Name</Label>
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
                                <Button variant="primary" onClick={addSchedule}>Submit</Button>
                            </ModalFooterActions>
                        </ModalFooter>
                    </Modal>
                </div>
            );
        }
    }

    const refreshList = () => {
        let scheduleLists = []
        setSchedule(scheduleLists);
        console.log(`Schedule(s) are: ${siteSchedule}`)
        let readData = JSON.stringify({
            "tableName": `Schedules`
        });
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${process.env.REACT_APP_URL}/unmarshalledScan`,
            headers: {},
            data: readData
        };
        axios.request(config)
            .then((response) => {
                let items = response.data
                setDynamoHours(items)
                for (let i = 0; i < items.length; i++) {
                    scheduleLists.push(items[i].campaign)
                }
                setSchedule(scheduleLists);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const deleteSchedule = () => {
        if (siteSchedule === "Standard") {
            toaster.push({
                message: 'Standard Schedule Cannot Be Deleted',
                variant: 'error',
                dismissAfter: 3000
            })
        } else {
            console.log(siteSchedule);
            if (siteSchedule.length === 0) {
                toaster.push({
                    message: 'Select List First',
                    variant: 'error',
                    dismissAfter: 3000,
                });
            } else {
                let scheduleToUpdate = [...schedule];
                const newArray = scheduleToUpdate.filter(item => item !== siteSchedule);
                // Filter out the selected campaign from dynamoHours and campaign lists
                let newSchedule = dynamoHours.filter(item => item.campaign !== siteSchedule);
                // Use filter to create a new array without mutating the original
                setDynamoHours(newSchedule);
                console.log(newSchedule, "NS", scheduleToUpdate)
                setSchedule(newArray)
                // Reset siteSchedule and update states
                setSiteSchedule(""); // Clear selected site
                // Update campaign list after resetting siteSchedule

                setDynamoHours(scheduleToUpdate);

                let deleteData = JSON.stringify({
                    "TableName": "Schedules",
                    "Key": {
                        "campaign": {
                            "S": siteSchedule,
                        },
                    },
                });

                let deleteConfig = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: `${process.env.REACT_APP_URL}/deleteItem`,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    data: deleteData,
                };

                console.log(deleteConfig);
                axios.request(deleteConfig)
                    .then((response) => {
                        setSavedSettings(true)
                        setComboboxKey(prevKey => prevKey + 1);
                        refreshList()
                    })
                    .catch((error) => {
                        console.log(error);
                    });
                setShowTimes(false)
            }
        }
    };

    useEffect(() => {
        let scheduleLists = []
        setSchedule(scheduleLists);
        console.log(`Schedule(s) are: ${siteSchedule}`)
        let readData = JSON.stringify({
            "tableName": `Schedules`
        });
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${process.env.REACT_APP_URL}/unmarshalledScan`,
            headers: {},
            data: readData
        };
        axios.request(config)
            .then((response) => {
                let items = response.data
                setDynamoHours(items)
                for (let i = 0; i < items.length; i++) {
                    scheduleLists.push(items[i].campaign)
                }
                setSchedule(scheduleLists);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);
    return (
        <div id="body" style={{ width: '50%' }}>
            <Heading as="h1" variant="heading10">
                Canpaign Schedules
            </Heading>
            <table>
                <tbody>
                    <tr>
                        <td>
                            <Combobox

                                key={comboboxKey}
                                items={schedule}
                                labelText="Select a Schedule"
                                required
                                value={siteSchedule}
                                onInputValueChange={({ inputValue }) => {
                                    console.log(schedule, "L")
                                    if (savedSettings) {
                                        setSiteSchedule(inputValue);
                                        getHours(inputValue);

                                    } else {
                                        toaster.push({
                                            message: 'Save Settings first',
                                            variant: 'error',
                                            dismissAfter: 3000,
                                        });
                                    }
                                }
                                }
                            />
                        </td>

                        <td>
                            <Label>&zwnj;</Label>
                            <Button variant="primary" onClick={setShifts}>Shifts</Button>
                        </td>

                        <td>
                            <Label>&zwnj;</Label>
                            <AddScheduleModal
                                isModalOpen={isModalOpen}
                            />
                        </td>
                        <td><Label>&zwnj;</Label>
                            <Button variant="primary" onClick={deleteSchedule}>Delete</Button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <br />

            {showTimes && !multiTimes ? <Table striped="true">
                <THead>
                    <Tr>
                        <Th>Day</Th>
                        <Th>Local Start Time</Th>
                        <Th>Local End Time</Th>
                        <Th>Closed</Th>
                    </Tr>
                </THead>
                <TBody>
                    <Tr>
                        <Td>Monday</Td>
                        <Td><TimePicker
                            aria-describedby="setMondayStart1"
                            id="setMondayStart1"
                            value={mondayStart1}
                            name="setMondayStart1"
                            disabled={mondayChecked}
                            onChange={(evt) => {

                                if (mondayEnd1.slice(0, 2) <= evt.target.value.slice(0, 2)) {
                                    setMondayHelp1(true)
                                } else { setMondayHelp1(false) }
                                setMondayStart1(`${evt.target.value}:00`)
                            }
                            }
                            required
                        /></Td>
                        <Td><TimePicker
                            aria-describedby="setMondayEnd1"
                            id="setMondayEnd1"
                            value={mondayEnd1}
                            min={mondayStart1}
                            name="setMondayEnd1"
                            disabled={mondayChecked}
                            onChange={(evt) => {

                                if (mondayStart1.slice(0, 2) >= evt.target.value.slice(0, 2)) {
                                    setMondayHelp1(true)
                                } else { setMondayHelp1(false) }
                                setMondayEnd1(`${evt.target.value}:00`)
                            }}
                            required
                        /></Td>
                        <Td textAlign='right'><Checkbox
                            id="mondayClosed"
                            value="mondayClosed"
                            name="mondayClosed"
                            checked={mondayChecked}
                            onChange={(event) => {
                                setMondayChecked(event.target.checked);
                                if (event.target.checked) {
                                    setMondayHelp1(false)
                                } else {
                                    if (mondayStart1.slice(0, 2) >= mondayEnd1.slice(0, 2)) {
                                        setMondayHelp1(true)
                                    }
                                }
                            }}
                        />
                        </Td>
                    </Tr>
                    {mondayHelp1 ? <Tr>
                        <Td></Td>
                        <Td></Td>
                        <Td><HelpText variant="error">
                            Select a time after the Start time.
                        </HelpText></Td>
                        <Td></Td>
                    </Tr> : null}
                    <Tr>
                        <Td>Tuesday</Td>
                        <Td><TimePicker
                            aria-describedby="setTuesdayStart1"
                            id="setTuesdayStart1"
                            value={tuesdayStart1}
                            name="setTuesdayStart1"
                            disabled={tuesdayChecked}
                            onChange={(evt) => {

                                if (tuesdayEnd1.slice(0, 2) <= evt.target.value.slice(0, 2)) {
                                    setTuesdayHelp1(true)
                                } else { setTuesdayHelp1(false) }
                                setTuesdayStart1(`${evt.target.value}:00`)
                            }
                            }
                            required
                        /></Td>
                        <Td><TimePicker
                            aria-describedby="setTuesdayEnd1"
                            id="setTuesdayEnd1"
                            value={tuesdayEnd1}
                            min={tuesdayStart1}
                            name="setTuesdayEnd1"
                            disabled={tuesdayChecked}
                            onChange={(evt) => {

                                if (tuesdayStart1.slice(0, 2) >= evt.target.value.slice(0, 2)) {
                                    setTuesdayHelp1(true)
                                } else { setTuesdayHelp1(false) }
                                setTuesdayEnd1(`${evt.target.value}:00`)
                            }}
                            required
                        /></Td>
                        <Td textAlign='right'><Checkbox
                            id="tuesdayClosed"
                            value="tuesdayClosed"
                            name="tuesdayClosed"
                            checked={tuesdayChecked}
                            onChange={(event) => {
                                setTuesdayChecked(event.target.checked);
                                if (event.target.checked) {
                                    setTuesdayHelp1(false)
                                } else {
                                    if (tuesdayStart1.slice(0, 2) >= tuesdayEnd1.slice(0, 2)) {
                                        setTuesdayHelp1(true)
                                    }
                                }
                            }}
                        />
                        </Td>
                    </Tr>
                    {tuesdayHelp1 ? <Tr>
                        <Td></Td>
                        <Td></Td>
                        <Td><HelpText variant="error">
                            Select a time after the Start time.
                        </HelpText></Td>
                        <Td></Td>
                    </Tr> : null}
                    <Tr>
                        <Td>Wednesday</Td>
                        <Td><TimePicker
                            aria-describedby="setWednesdayStart1"
                            id="setWednesdayStart1"
                            value={wednesdayStart1}
                            name="setWednesdayStart1"
                            disabled={wednesdayChecked}
                            onChange={(evt) => {

                                if (wednesdayEnd1.slice(0, 2) <= evt.target.value.slice(0, 2)) {
                                    setWednesdayHelp1(true)
                                } else { setWednesdayHelp1(false) }
                                setWednesdayStart1(`${evt.target.value}:00`)
                            }
                            }
                            required
                        /></Td>
                        <Td><TimePicker
                            aria-describedby="setWednesdayEnd1"
                            id="setWednesdayEnd1"
                            value={wednesdayEnd1}
                            min={wednesdayStart1}
                            name="setWednesdayEnd1"
                            disabled={wednesdayChecked}
                            onChange={(evt) => {

                                if (wednesdayStart1.slice(0, 2) >= evt.target.value.slice(0, 2)) {
                                    setWednesdayHelp1(true)
                                } else { setWednesdayHelp1(false) }
                                setWednesdayEnd1(`${evt.target.value}:00`)
                            }}
                            required
                        /></Td>
                        <Td textAlign='right'><Checkbox
                            id="wednesdayClosed"
                            value="wednesdayClosed"
                            name="wednesdayClosed"
                            checked={wednesdayChecked}
                            onChange={(event) => {
                                setWednesdayChecked(event.target.checked);
                                if (event.target.checked) {
                                    setWednesdayHelp1(false)
                                } else {
                                    if (wednesdayStart1.slice(0, 2) >= wednesdayEnd1.slice(0, 2)) {
                                        setWednesdayHelp1(true)
                                    }
                                }
                            }}
                        />
                        </Td>
                    </Tr>
                    {wednesdayHelp1 ? <Tr>
                        <Td></Td>
                        <Td></Td>
                        <Td><HelpText variant="error">
                            Select a time after the Start time.
                        </HelpText></Td>
                        <Td></Td>
                    </Tr> : null}
                    <Tr>
                        <Td>Thursday</Td>
                        <Td><TimePicker
                            aria-describedby="setThursdayStart1"
                            id="setThursdayStart1"
                            value={thursdayStart1}
                            name="setThursdayStart1"
                            disabled={thursdayChecked}
                            onChange={(evt) => {

                                if (thursdayEnd1.slice(0, 2) <= evt.target.value.slice(0, 2)) {
                                    setThursdayHelp1(true)
                                } else { setThursdayHelp1(false) }
                                setThursdayStart1(`${evt.target.value}:00`)
                            }
                            }
                            required
                        /></Td>
                        <Td><TimePicker
                            aria-describedby="setThursdayEnd1"
                            id="setThursdayEnd1"
                            value={thursdayEnd1}
                            min={thursdayStart1}
                            name="setThursdayEnd1"
                            disabled={thursdayChecked}
                            onChange={(evt) => {

                                if (thursdayStart1.slice(0, 2) >= evt.target.value.slice(0, 2)) {
                                    setThursdayHelp1(true)
                                } else { setThursdayHelp1(false) }
                                setThursdayEnd1(`${evt.target.value}:00`)
                            }}
                            required
                        /></Td>
                        <Td textAlign='right'><Checkbox
                            id="thursdayClosed"
                            value="thursdayClosed"
                            name="thursdayClosed"
                            checked={thursdayChecked}
                            onChange={(event) => {
                                setThursdayChecked(event.target.checked);
                                if (event.target.checked) {
                                    setThursdayHelp1(false)
                                } else {
                                    if (thursdayStart1.slice(0, 2) >= thursdayEnd1.slice(0, 2)) {
                                        setThursdayHelp1(true)
                                    }
                                }
                            }}
                        />
                        </Td>
                    </Tr>
                    {thursdayHelp1 ? <Tr>
                        <Td></Td>
                        <Td></Td>
                        <Td><HelpText variant="error">
                            Select a time after the Start time.
                        </HelpText></Td>
                        <Td></Td>
                    </Tr> : null}
                    <Tr>
                        <Td>Friday</Td>
                        <Td><TimePicker
                            aria-describedby="setFridayStart1"
                            id="setFridayStart1"
                            value={fridayStart1}
                            name="setFridayStart1"
                            disabled={fridayChecked}
                            onChange={(evt) => {

                                if (fridayEnd1.slice(0, 2) <= evt.target.value.slice(0, 2)) {
                                    setFridayHelp1(true)
                                } else { setFridayHelp1(false) }
                                setFridayStart1(`${evt.target.value}:00`)
                            }
                            }
                            required
                        /></Td>
                        <Td><TimePicker
                            aria-describedby="setFridayEnd1"
                            id="setFridayEnd1"
                            value={fridayEnd1}
                            min={fridayStart1}
                            name="setFridayEnd1"
                            disabled={fridayChecked}
                            onChange={(evt) => {

                                if (fridayStart1.slice(0, 2) >= evt.target.value.slice(0, 2)) {
                                    setFridayHelp1(true)
                                } else { setFridayHelp1(false) }
                                setFridayEnd1(`${evt.target.value}:00`)
                            }}
                            required
                        /></Td>
                        <Td textAlign='right'><Checkbox
                            id="fridayClosed"
                            value="fridayClosed"
                            name="fridayClosed"
                            checked={fridayChecked}
                            onChange={(event) => {
                                setFridayChecked(event.target.checked);
                                if (event.target.checked) {
                                    setFridayHelp1(false)
                                } else {
                                    if (fridayStart1.slice(0, 2) >= fridayEnd1.slice(0, 2)) {
                                        setFridayHelp1(true)
                                    }
                                }
                            }}
                        />
                        </Td>
                    </Tr>
                    {fridayHelp1 ? <Tr>
                        <Td></Td>
                        <Td></Td>
                        <Td><HelpText variant="error">
                            Select a time after the Start time.
                        </HelpText></Td>
                        <Td></Td>
                    </Tr> : null}
                    <Tr>
                        <Td>Saturday</Td>
                        <Td><TimePicker
                            aria-describedby="setSaturdayStart1"
                            id="setSaturdayStart1"
                            value={saturdayStart1}
                            name="setSaturdayStart1"
                            disabled={saturdayChecked}
                            onChange={(evt) => {

                                if (saturdayEnd1.slice(0, 2) <= evt.target.value.slice(0, 2)) {
                                    setSaturdayHelp1(true)
                                } else { setSaturdayHelp1(false) }
                                setSaturdayStart1(`${evt.target.value}:00`)
                            }
                            }
                            required
                        /></Td>
                        <Td><TimePicker
                            aria-describedby="setSaturdayEnd1"
                            id="setSaturdayEnd1"
                            value={saturdayEnd1}
                            min={saturdayStart1}
                            name="setSaturdayEnd1"
                            disabled={saturdayChecked}
                            onChange={(evt) => {

                                if (saturdayStart1.slice(0, 2) >= evt.target.value.slice(0, 2)) {
                                    setSaturdayHelp1(true)
                                } else { setSaturdayHelp1(false) }
                                setSaturdayEnd1(`${evt.target.value}:00`)
                            }}
                            required
                        /></Td>
                        <Td textAlign='right'><Checkbox
                            id="saturdayClosed"
                            value="saturdayClosed"
                            name="saturdayClosed"
                            checked={saturdayChecked}
                            onChange={(event) => {
                                setSaturdayChecked(event.target.checked);
                                if (event.target.checked) {
                                    setSaturdayHelp1(false)
                                } else {
                                    if (saturdayStart1.slice(0, 2) >= saturdayEnd1.slice(0, 2)) {
                                        setSaturdayHelp1(true)
                                    }
                                }
                            }}
                        />
                        </Td>
                    </Tr>
                    {saturdayHelp1 ? <Tr>
                        <Td></Td>
                        <Td></Td>
                        <Td><HelpText variant="error">
                            Select a time after the Start time.
                        </HelpText></Td>
                        <Td></Td>
                    </Tr> : null}
                    <Tr>
                        <Td>Sunday</Td>
                        <Td><TimePicker
                            aria-describedby="setSundayStart1"
                            id="setSundayStart1"
                            value={sundayStart1}
                            name="setSundayStart1"
                            disabled={sundayChecked}
                            onChange={(evt) => {

                                if (sundayEnd1.slice(0, 2) <= evt.target.value.slice(0, 2)) {
                                    setSundayHelp1(true)
                                } else { setSundayHelp1(false) }
                                setSundayStart1(`${evt.target.value}:00`)
                            }
                            }
                            required
                        /></Td>
                        <Td><TimePicker
                            aria-describedby="setSundayEnd1"
                            id="setSundayEnd1"
                            value={sundayEnd1}
                            min={sundayStart1}
                            name="setSundayEnd1"
                            disabled={sundayChecked}
                            onChange={(evt) => {

                                if (sundayStart1.slice(0, 2) >= evt.target.value.slice(0, 2)) {
                                    setSundayHelp1(true)
                                } else { setSundayHelp1(false) }
                                setSundayEnd1(`${evt.target.value}:00`)
                            }}
                            required
                        /></Td>
                        <Td textAlign='right'><Checkbox
                            id="sundayClosed"
                            value="sundayClosed"
                            name="sundayClosed"
                            checked={sundayChecked}
                            onChange={(event) => {
                                setSundayChecked(event.target.checked);
                                if (event.target.checked) {
                                    setSundayHelp1(false)
                                } else {
                                    if (sundayStart1.slice(0, 2) >= sundayEnd1.slice(0, 2)) {
                                        setSundayHelp1(true)
                                    }
                                }
                            }}
                        />
                        </Td>
                    </Tr>
                    {sundayHelp1 ? <Tr>
                        <Td></Td>
                        <Td></Td>
                        <Td><HelpText variant="error">
                            Select a time after the Start time.
                        </HelpText></Td>
                        <Td></Td>
                    </Tr> : null}
                </TBody>
                <TFoot>
                    <Tr>
                        <Td></Td>
                        <Td></Td>
                        <Td></Td>
                        <Td align='center'><Button variant="primary" onClick={saveTimes}>Save</Button>
                        </Td>
                    </Tr>
                </TFoot>
            </Table> : null}

            {showTimes && multiTimes ? <Table striped="true">
                <THead>
                    <Tr>
                        <Th>Day</Th>
                        <Th>Local Start1 Time</Th>
                        <Th>Local End1 Time</Th>
                        <Th>Local Start2 Time</Th>
                        <Th>Local End2 Time</Th>
                        <Th>Closed</Th>
                    </Tr>
                </THead>
                <TBody>
                    <Tr>
                        <Td>Monday</Td>
                        <Td><TimePicker
                            aria-describedby="setMondayStart1"
                            id="setMondayStart1"
                            value={mondayStart1.slice(0, 5)}
                            name="setMondayStart1"
                            disabled={mondayChecked}
                            onChange={(evt) => {
                                if (mondayEnd1.slice(0, 2) <= evt.target.value.slice(0, 2)) {
                                    setMondayHelp1(true)
                                } else {
                                    setMondayHelp1(false)
                                }
                                setMondayStart1(`${evt.target.value}:00`)
                            }}
                            required
                        /></Td>
                        <Td><TimePicker
                            aria-describedby="setMondayEnd1"
                            id="setMondayEnd1"
                            value={mondayEnd1.slice(0, 5)}
                            min={mondayStart1}
                            name="setMondayEnd1"
                            disabled={mondayChecked}
                            onChange={(evt) => {
                                if (mondayStart1.slice(0, 2) >= evt.target.value.slice(0, 2)) {
                                    setMondayHelp1(true)
                                } else { setMondayHelp1(false) }
                                if (mondayStart2.slice(0, 2) <= evt.target.value.slice(0, 2)) {
                                    setMondayHelp2(true)
                                } else {
                                    setMondayHelp2(false)
                                }
                                setMondayEnd1(`${evt.target.value}:00`)
                            }}
                            required
                        /></Td>
                        <Td><TimePicker
                            aria-describedby="setMondayStart2"
                            id="setMondayStart2"
                            value={mondayStart2.slice(0, 5)}
                            name="setMondayStart2"
                            disabled={mondayChecked}
                            onChange={(evt) => {
                                if (mondayEnd1.slice(0, 2) >= evt.target.value.slice(0, 2)) {
                                    setMondayHelp2(true)
                                } else {
                                    setMondayHelp2(false)
                                }
                                if (mondayEnd2.slice(0, 2) <= evt.target.value.slice(0, 2)) {
                                    setMondayHelp3(true)
                                } else {
                                    setMondayHelp3(false)
                                }
                                setMondayStart2(`${evt.target.value}:00`)
                            }}
                            required
                        /></Td>
                        <Td><TimePicker
                            aria-describedby="setMondayEnd2"
                            id="setMondayEnd2"
                            value={mondayEnd2.slice(0, 5)}
                            min={mondayStart2}
                            name="setMondayEnd2"
                            disabled={mondayChecked}
                            onChange={(evt) => {
                                if (mondayStart2.slice(0, 2) >= evt.target.value.slice(0, 2)) {
                                    setMondayHelp3(true)
                                } else { setMondayHelp3(false) }
                                setMondayEnd2(`${evt.target.value}:00`)
                            }}
                            required
                        /></Td>
                        <Td textAlign='right'><Checkbox
                            id="mondayClosed"
                            value="mondayClosed"
                            name="mondayClosed"
                            checked={mondayChecked}
                            onChange={(event) => {
                                if (event.target.checked === true) {
                                    setMondayHelp1(false)
                                    setMondayHelp2(false)
                                    setMondayHelp3(false)
                                } else {
                                    if (mondayStart1.slice(0, 2) >= mondayEnd1.slice(0, 2)) {
                                        setMondayHelp1(true)
                                    }
                                    if (mondayStart2.slice(0, 2) <= mondayEnd1.slice(0, 2)) {
                                        setMondayHelp2(true)
                                    }
                                    if (mondayStart2.slice(0, 2) >= mondayEnd2.slice(0, 2)) {
                                        setMondayHelp3(true)
                                    }
                                }
                                setMondayChecked(event.target.checked);
                            }}
                        />
                        </Td>
                    </Tr>
                    {mondayHelp1 || mondayHelp2 || mondayHelp3 ?
                        <Tr>
                            <Td></Td>
                            <Td></Td>
                            {mondayHelp1 ?
                                <Td><HelpText variant="error">
                                    Select a time after the Start1 time.
                                </HelpText>
                                </Td>
                                : <Td></Td>}
                            {mondayHelp2 ?
                                <Td><HelpText variant="error">
                                    Select a time after the End1 time.
                                </HelpText>
                                </Td>
                                : <Td></Td>}
                            {mondayHelp3 ?
                                <Td><HelpText variant="error">
                                    Select a time after the Start2 time.
                                </HelpText>
                                </Td>
                                : <Td></Td>
                            }
                            <Td></Td>
                        </Tr> : null}
                    <Tr>
                        <Td>Tuesday</Td>
                        <Td><TimePicker
                            aria-describedby="setTuesdayStart1"
                            id="setTuesdayStart1"
                            value={tuesdayStart1.slice(0, 5)}
                            name="setTuesdayStart1"
                            disabled={tuesdayChecked}
                            onChange={(evt) => {
                                if (tuesdayEnd1.slice(0, 2) <= evt.target.value.slice(0, 2)) {
                                    setTuesdayHelp1(true)
                                } else {
                                    setTuesdayHelp1(false)
                                }
                                setTuesdayStart1(`${evt.target.value}:00`)
                            }
                            }
                            required
                        /></Td>
                        <Td><TimePicker
                            aria-describedby="setTuesdayEnd1"
                            id="setTuesdayEnd1"
                            value={tuesdayEnd1.slice(0, 5)}
                            min={tuesdayStart1}
                            name="setTuesdayEnd1"
                            disabled={tuesdayChecked}
                            onChange={(evt) => {
                                if (tuesdayStart1.slice(0, 2) >= evt.target.value.slice(0, 2)) {
                                    setTuesdayHelp1(true)
                                } else { setTuesdayHelp1(false) }
                                if (tuesdayStart2.slice(0, 2) <= evt.target.value.slice(0, 2)) {
                                    setTuesdayHelp2(true)
                                } else {
                                    setTuesdayHelp2(false)
                                }
                                setTuesdayEnd1(`${evt.target.value}:00`)
                            }}
                            required
                        /></Td>
                        <Td><TimePicker
                            aria-describedby="setTuesdayStart2"
                            id="setTuesdayStart2"
                            value={tuesdayStart2.slice(0, 5)}
                            name="setTuesdayStart2"
                            disabled={tuesdayChecked}
                            onChange={(evt) => {
                                if (tuesdayEnd1.slice(0, 2) >= evt.target.value.slice(0, 2)) {
                                    setTuesdayHelp2(true)
                                } else {
                                    setTuesdayHelp2(false)
                                }
                                if (tuesdayEnd2.slice(0, 2) <= evt.target.value.slice(0, 2)) {
                                    setTuesdayHelp3(true)
                                } else {
                                    setTuesdayHelp3(false)
                                }
                                setTuesdayStart2(`${evt.target.value}:00`)
                            }}
                            required
                        /></Td>
                        <Td><TimePicker
                            aria-describedby="setTuesdayEnd2"
                            id="setTuesdayEnd2"
                            value={tuesdayEnd2.slice(0, 5)}
                            min={tuesdayStart2}
                            name="setTuesdayEnd2"
                            disabled={tuesdayChecked}
                            onChange={(evt) => {
                                if (tuesdayStart2.slice(0, 2) >= evt.target.value.slice(0, 2)) {
                                    setTuesdayHelp3(true)
                                } else { setTuesdayHelp3(false) }
                                setTuesdayEnd2(`${evt.target.value}:00`)
                            }}
                            required
                        /></Td>
                        <Td textAlign='right'><Checkbox
                            id="tuesdayClosed"
                            value="tuesdayClosed"
                            name="tuesdayClosed"
                            checked={tuesdayChecked}
                            onChange={(event) => {
                                if (event.target.checked === true) {
                                    setTuesdayHelp1(false)
                                    setTuesdayHelp2(false)
                                    setTuesdayHelp3(false)
                                } else {
                                    if (tuesdayStart1.slice(0, 2) >= tuesdayEnd1.slice(0, 2)) {
                                        setTuesdayHelp1(true)
                                    }
                                    if (tuesdayStart2.slice(0, 2) <= tuesdayEnd1.slice(0, 2)) {
                                        setTuesdayHelp2(true)
                                    }
                                    if (tuesdayStart2.slice(0, 2) >= tuesdayEnd2.slice(0, 2)) {
                                        setTuesdayHelp3(true)
                                    }
                                }
                                setTuesdayChecked(event.target.checked);
                            }}
                        />
                        </Td>
                    </Tr>
                    {tuesdayHelp1 || tuesdayHelp2 || tuesdayHelp3 ?
                        <Tr>
                            <Td></Td>
                            <Td></Td>
                            {tuesdayHelp1 ?
                                <Td><HelpText variant="error">
                                    Select a time after the Start1 time.
                                </HelpText>
                                </Td>
                                : <Td></Td>}
                            {tuesdayHelp2 ?
                                <Td><HelpText variant="error">
                                    Select a time after the End1 time.
                                </HelpText>
                                </Td>
                                : <Td></Td>}
                            {tuesdayHelp3 ?
                                <Td><HelpText variant="error">
                                    Select a time after the Start2 time.
                                </HelpText>
                                </Td>
                                : <Td></Td>
                            }
                            <Td></Td>
                        </Tr> : null}
                    <Tr>
                        <Td>Wednesday</Td>
                        <Td><TimePicker
                            aria-describedby="setWednesdayStart1"
                            id="setWednesdayStart1"
                            value={wednesdayStart1.slice(0, 5)}
                            name="setWednesdayStart1"
                            disabled={wednesdayChecked}
                            onChange={(evt) => {
                                if (wednesdayEnd1.slice(0, 2) <= evt.target.value.slice(0, 2)) {
                                    setWednesdayHelp1(true)
                                } else {
                                    setWednesdayHelp1(false)
                                }
                                setWednesdayStart1(`${evt.target.value}:00`)
                            }
                            }
                            required
                        /></Td>
                        <Td><TimePicker
                            aria-describedby="setWednesdayEnd1"
                            id="setWednesdayEnd1"
                            value={wednesdayEnd1.slice(0, 5)}
                            min={wednesdayStart1}
                            name="setWednesdayEnd1"
                            disabled={wednesdayChecked}
                            onChange={(evt) => {
                                if (wednesdayStart1.slice(0, 2) >= evt.target.value.slice(0, 2)) {
                                    setWednesdayHelp1(true)
                                } else { setWednesdayHelp1(false) }
                                if (wednesdayStart2.slice(0, 2) <= evt.target.value.slice(0, 2)) {
                                    setWednesdayHelp2(true)
                                } else {
                                    setWednesdayHelp2(false)
                                }
                                setWednesdayEnd1(`${evt.target.value}:00`)
                            }}
                            required
                        /></Td>
                        <Td><TimePicker
                            aria-describedby="setWednesdayStart2"
                            id="setWednesdayStart2"
                            value={wednesdayStart2.slice(0, 5)}
                            name="setWednesdayStart2"
                            disabled={wednesdayChecked}
                            onChange={(evt) => {
                                if (wednesdayEnd1.slice(0, 2) >= evt.target.value.slice(0, 2)) {
                                    setWednesdayHelp2(true)
                                } else {
                                    setWednesdayHelp2(false)
                                }
                                if (wednesdayEnd2.slice(0, 2) <= evt.target.value.slice(0, 2)) {
                                    setWednesdayHelp3(true)
                                } else {
                                    setWednesdayHelp3(false)
                                }
                                setWednesdayStart2(`${evt.target.value}:00`)
                            }}
                            required
                        /></Td>
                        <Td><TimePicker
                            aria-describedby="setWednesdayEnd2"
                            id="setWednesdayEnd2"
                            value={wednesdayEnd2.slice(0, 5)}
                            min={wednesdayStart2}
                            name="setWednesdayEnd2"
                            disabled={wednesdayChecked}
                            onChange={(evt) => {
                                if (wednesdayStart2.slice(0, 2) >= evt.target.value.slice(0, 2)) {
                                    setWednesdayHelp3(true)
                                } else { setWednesdayHelp3(false) }
                                setWednesdayEnd2(`${evt.target.value}:00`)
                            }}
                            required
                        /></Td>
                        <Td textAlign='right'><Checkbox
                            id="wednesdayClosed"
                            value="wednesdayClosed"
                            name="wednesdayClosed"
                            checked={wednesdayChecked}
                            onChange={(event) => {
                                if (event.target.checked === true) {
                                    setWednesdayHelp1(false)
                                    setWednesdayHelp2(false)
                                    setWednesdayHelp3(false)
                                } else {
                                    if (wednesdayStart1.slice(0, 2) >= wednesdayEnd1.slice(0, 2)) {
                                        setWednesdayHelp1(true)
                                    }
                                    if (wednesdayStart2.slice(0, 2) <= wednesdayEnd1.slice(0, 2)) {
                                        setWednesdayHelp2(true)
                                    }
                                    if (wednesdayStart2.slice(0, 2) >= wednesdayEnd2.slice(0, 2)) {
                                        setWednesdayHelp3(true)
                                    }
                                }
                                setWednesdayChecked(event.target.checked);
                            }}
                        />
                        </Td>
                    </Tr>
                    {wednesdayHelp1 || wednesdayHelp2 || wednesdayHelp3 ?
                        <Tr>
                            <Td></Td>
                            <Td></Td>
                            {wednesdayHelp1 ?
                                <Td><HelpText variant="error">
                                    Select a time after the Start1 time.
                                </HelpText>
                                </Td>
                                : <Td></Td>}
                            {wednesdayHelp2 ?
                                <Td><HelpText variant="error">
                                    Select a time after the End1 time.
                                </HelpText>
                                </Td>
                                : <Td></Td>}
                            {wednesdayHelp3 ?
                                <Td><HelpText variant="error">
                                    Select a time after the Start2 time.
                                </HelpText>
                                </Td>
                                : <Td></Td>
                            }
                            <Td></Td>
                        </Tr> : null}
                    <Tr>
                        <Td>Thursday</Td>
                        <Td><TimePicker
                            aria-describedby="setThursdayStart1"
                            id="setThursdayStart1"
                            value={thursdayStart1.slice(0, 5)}
                            name="setThursdayStart1"
                            disabled={thursdayChecked}
                            onChange={(evt) => {
                                if (thursdayEnd1.slice(0, 2) <= evt.target.value.slice(0, 2)) {
                                    setThursdayHelp1(true)
                                } else {
                                    setThursdayHelp1(false)
                                }
                                setThursdayStart1(`${evt.target.value}:00`)
                            }
                            }
                            required
                        /></Td>
                        <Td><TimePicker
                            aria-describedby="setThursdayEnd1"
                            id="setThursdayEnd1"
                            value={thursdayEnd1.slice(0, 5)}
                            min={thursdayStart1}
                            name="setThursdayEnd1"
                            disabled={thursdayChecked}
                            onChange={(evt) => {
                                if (thursdayStart1.slice(0, 2) >= evt.target.value.slice(0, 2)) {
                                    setThursdayHelp1(true)
                                } else { setThursdayHelp1(false) }
                                if (thursdayStart2.slice(0, 2) <= evt.target.value.slice(0, 2)) {
                                    setThursdayHelp2(true)
                                } else {
                                    setThursdayHelp2(false)
                                }
                                setThursdayEnd1(`${evt.target.value}:00`)
                            }}
                            required
                        /></Td>
                        <Td><TimePicker
                            aria-describedby="setThursdayStart2"
                            id="setThursdayStart2"
                            value={thursdayStart2.slice(0, 5)}
                            name="setThursdayStart2"
                            disabled={thursdayChecked}
                            onChange={(evt) => {
                                if (thursdayEnd1.slice(0, 2) >= evt.target.value.slice(0, 2)) {
                                    setThursdayHelp2(true)
                                } else {
                                    setThursdayHelp2(false)
                                }
                                if (thursdayEnd2.slice(0, 2) <= evt.target.value.slice(0, 2)) {
                                    setThursdayHelp3(true)
                                } else {
                                    setThursdayHelp3(false)
                                }
                                setThursdayStart2(`${evt.target.value}:00`)
                            }}
                            required
                        /></Td>
                        <Td><TimePicker
                            aria-describedby="setThursdayEnd2"
                            id="setThursdayEnd2"
                            value={thursdayEnd2.slice(0, 5)}
                            min={thursdayStart2}
                            name="setThursdayEnd2"
                            disabled={thursdayChecked}
                            onChange={(evt) => {
                                if (thursdayStart2.slice(0, 2) >= evt.target.value.slice(0, 2)) {
                                    setThursdayHelp3(true)
                                } else { setThursdayHelp3(false) }
                                setThursdayEnd2(`${evt.target.value}:00`)
                            }}
                            required
                        /></Td>
                        <Td textAlign='right'><Checkbox
                            id="thursdayClosed"
                            value="thursdayClosed"
                            name="thursdayClosed"
                            checked={thursdayChecked}
                            onChange={(event) => {
                                if (event.target.checked === true) {
                                    setThursdayHelp1(false)
                                    setThursdayHelp2(false)
                                    setThursdayHelp3(false)
                                } else {
                                    if (thursdayStart1.slice(0, 2) >= thursdayEnd1.slice(0, 2)) {
                                        setThursdayHelp1(true)
                                    }
                                    if (thursdayStart2.slice(0, 2) <= thursdayEnd1.slice(0, 2)) {
                                        setThursdayHelp2(true)
                                    }
                                    if (thursdayStart2.slice(0, 2) >= thursdayEnd2.slice(0, 2)) {
                                        setThursdayHelp3(true)
                                    }
                                }
                                setThursdayChecked(event.target.checked);
                            }}
                        />
                        </Td>
                    </Tr>
                    {thursdayHelp1 || thursdayHelp2 || thursdayHelp3 ?
                        <Tr>
                            <Td></Td>
                            <Td></Td>
                            {thursdayHelp1 ?
                                <Td><HelpText variant="error">
                                    Select a time after the Start1 time.
                                </HelpText>
                                </Td>
                                : <Td></Td>}
                            {thursdayHelp2 ?
                                <Td><HelpText variant="error">
                                    Select a time after the End1 time.
                                </HelpText>
                                </Td>
                                : <Td></Td>}
                            {thursdayHelp3 ?
                                <Td><HelpText variant="error">
                                    Select a time after the Start2 time.
                                </HelpText>
                                </Td>
                                : <Td></Td>
                            }
                            <Td></Td>
                        </Tr> : null}
                    <Tr>
                        <Td>Friday</Td>
                        <Td><TimePicker
                            aria-describedby="setFridayStart1"
                            id="setFridayStart1"
                            value={fridayStart1.slice(0, 5)}
                            name="setFridayStart1"
                            disabled={fridayChecked}
                            onChange={(evt) => {
                                if (fridayEnd1.slice(0, 2) <= evt.target.value.slice(0, 2)) {
                                    setFridayHelp1(true)
                                } else {
                                    setFridayHelp1(false)
                                }
                                setFridayStart1(`${evt.target.value}:00`)
                            }
                            }
                            required
                        /></Td>
                        <Td><TimePicker
                            aria-describedby="setFridayEnd1"
                            id="setFridayEnd1"
                            value={fridayEnd1.slice(0, 5)}
                            min={fridayStart1}
                            name="setFridayEnd1"
                            disabled={fridayChecked}
                            onChange={(evt) => {
                                if (fridayStart1.slice(0, 2) >= evt.target.value.slice(0, 2)) {
                                    setFridayHelp1(true)
                                } else { setFridayHelp1(false) }
                                if (fridayStart2.slice(0, 2) <= evt.target.value.slice(0, 2)) {
                                    setFridayHelp2(true)
                                } else {
                                    setFridayHelp2(false)
                                }
                                setFridayEnd1(`${evt.target.value}:00`)
                            }}
                            required
                        /></Td>
                        <Td><TimePicker
                            aria-describedby="setFridayStart2"
                            id="setFridayStart2"
                            value={fridayStart2.slice(0, 5)}
                            name="setFridayStart2"
                            disabled={fridayChecked}
                            onChange={(evt) => {
                                if (fridayEnd1.slice(0, 2) >= evt.target.value.slice(0, 2)) {
                                    setFridayHelp2(true)
                                } else {
                                    setFridayHelp2(false)
                                }
                                if (fridayEnd2.slice(0, 2) <= evt.target.value.slice(0, 2)) {
                                    setFridayHelp3(true)
                                } else {
                                    setFridayHelp3(false)
                                }
                                setFridayStart2(`${evt.target.value}:00`)
                            }}
                            required
                        /></Td>
                        <Td><TimePicker
                            aria-describedby="setFridayEnd2"
                            id="setFridayEnd2"
                            value={fridayEnd2.slice(0, 5)}
                            min={fridayStart2}
                            name="setFridayEnd2"
                            disabled={fridayChecked}
                            onChange={(evt) => {
                                if (fridayStart2.slice(0, 2) >= evt.target.value.slice(0, 2)) {
                                    setFridayHelp3(true)
                                } else { setFridayHelp3(false) }
                                setFridayEnd2(`${evt.target.value}:00`)
                            }}
                            required
                        /></Td>
                        <Td textAlign='right'><Checkbox
                            id="fridayClosed"
                            value="fridayClosed"
                            name="fridayClosed"
                            checked={fridayChecked}
                            onChange={(event) => {
                                if (event.target.checked === true) {
                                    setFridayHelp1(false)
                                    setFridayHelp2(false)
                                    setFridayHelp3(false)
                                } else {
                                    if (fridayStart1.slice(0, 2) >= fridayEnd1.slice(0, 2)) {
                                        setFridayHelp1(true)
                                    }
                                    if (fridayStart2.slice(0, 2) <= fridayEnd1.slice(0, 2)) {
                                        setFridayHelp2(true)
                                    }
                                    if (fridayStart2.slice(0, 2) >= fridayEnd2.slice(0, 2)) {
                                        setFridayHelp3(true)
                                    }
                                }
                                setFridayChecked(event.target.checked);
                            }}
                        />
                        </Td>
                    </Tr>
                    {fridayHelp1 || fridayHelp2 || fridayHelp3 ?
                        <Tr>
                            <Td></Td>
                            <Td></Td>
                            {fridayHelp1 ?
                                <Td><HelpText variant="error">
                                    Select a time after the Start1 time.
                                </HelpText>
                                </Td>
                                : <Td></Td>}
                            {fridayHelp2 ?
                                <Td><HelpText variant="error">
                                    Select a time after the End1 time.
                                </HelpText>
                                </Td>
                                : <Td></Td>}
                            {fridayHelp3 ?
                                <Td><HelpText variant="error">
                                    Select a time after the Start2 time.
                                </HelpText>
                                </Td>
                                : <Td></Td>
                            }
                            <Td></Td>
                        </Tr> : null}
                    <Tr>
                        <Td>Saturday</Td>
                        <Td><TimePicker
                            aria-describedby="setSaturdayStart1"
                            id="setSaturdayStart1"
                            value={saturdayStart1.slice(0, 5)}
                            name="setSaturdayStart1"
                            disabled={saturdayChecked}
                            onChange={(evt) => {
                                if (saturdayEnd1.slice(0, 2) <= evt.target.value.slice(0, 2)) {
                                    setSaturdayHelp1(true)
                                } else {
                                    setSaturdayHelp1(false)
                                }
                                setSaturdayStart1(`${evt.target.value}:00`)
                            }
                            }
                            required
                        /></Td>
                        <Td><TimePicker
                            aria-describedby="setSaturdayEnd1"
                            id="setSaturdayEnd1"
                            value={saturdayEnd1.slice(0, 5)}
                            min={saturdayStart1}
                            name="setSaturdayEnd1"
                            disabled={saturdayChecked}
                            onChange={(evt) => {
                                if (saturdayStart1.slice(0, 2) >= evt.target.value.slice(0, 2)) {
                                    setSaturdayHelp1(true)
                                } else { setSaturdayHelp1(false) }
                                if (saturdayStart2.slice(0, 2) <= evt.target.value.slice(0, 2)) {
                                    setSaturdayHelp2(true)
                                } else {
                                    setSaturdayHelp2(false)
                                }
                                setSaturdayEnd1(`${evt.target.value}:00`)
                            }}
                            required
                        /></Td>
                        <Td><TimePicker
                            aria-describedby="setSaturdayStart2"
                            id="setSaturdayStart2"
                            value={saturdayStart2.slice(0, 5)}
                            name="setSaturdayStart2"
                            disabled={saturdayChecked}
                            onChange={(evt) => {
                                if (saturdayEnd1.slice(0, 2) >= evt.target.value.slice(0, 2)) {
                                    setSaturdayHelp2(true)
                                } else {
                                    setSaturdayHelp2(false)
                                }
                                if (saturdayEnd2.slice(0, 2) <= evt.target.value.slice(0, 2)) {
                                    setSaturdayHelp3(true)
                                } else {
                                    setSaturdayHelp3(false)
                                }
                                setSaturdayStart2(`${evt.target.value}:00`)
                            }}
                            required
                        /></Td>
                        <Td><TimePicker
                            aria-describedby="setSaturdayEnd2"
                            id="setSaturdayEnd2"
                            value={saturdayEnd2.slice(0, 5)}
                            min={saturdayStart2}
                            name="setSaturdayEnd2"
                            disabled={saturdayChecked}
                            onChange={(evt) => {
                                if (saturdayStart2.slice(0, 2) >= evt.target.value.slice(0, 2)) {
                                    setSaturdayHelp3(true)
                                } else { setSaturdayHelp3(false) }
                                setSaturdayEnd2(`${evt.target.value}:00`)
                            }}
                            required
                        /></Td>
                        <Td textAlign='right'><Checkbox
                            id="saturdayClosed"
                            value="saturdayClosed"
                            name="saturdayClosed"
                            checked={saturdayChecked}
                            onChange={(event) => {
                                if (event.target.checked === true) {
                                    setSaturdayHelp1(false)
                                    setSaturdayHelp2(false)
                                    setSaturdayHelp3(false)
                                } else {
                                    if (saturdayStart1.slice(0, 2) >= saturdayEnd1.slice(0, 2)) {
                                        setSaturdayHelp1(true)
                                    }
                                    if (saturdayStart2.slice(0, 2) <= saturdayEnd1.slice(0, 2)) {
                                        setSaturdayHelp2(true)
                                    }
                                    if (saturdayStart2.slice(0, 2) >= saturdayEnd2.slice(0, 2)) {
                                        setSaturdayHelp3(true)
                                    }
                                }
                                setSaturdayChecked(event.target.checked);
                            }}
                        />
                        </Td>
                    </Tr>
                    {saturdayHelp1 || saturdayHelp2 || saturdayHelp3 ?
                        <Tr>
                            <Td></Td>
                            <Td></Td>
                            {saturdayHelp1 ?
                                <Td><HelpText variant="error">
                                    Select a time after the Start1 time.
                                </HelpText>
                                </Td>
                                : <Td></Td>}
                            {saturdayHelp2 ?
                                <Td><HelpText variant="error">
                                    Select a time after the End1 time.
                                </HelpText>
                                </Td>
                                : <Td></Td>}
                            {saturdayHelp3 ?
                                <Td><HelpText variant="error">
                                    Select a time after the Start2 time.
                                </HelpText>
                                </Td>
                                : <Td></Td>
                            }
                            <Td></Td>
                        </Tr> : null}
                    <Tr>
                        <Td>Sunday</Td>
                        <Td><TimePicker
                            aria-describedby="setSundayStart1"
                            id="setSundayStart1"
                            value={sundayStart1.slice(0, 5)}
                            name="setSundayStart1"
                            disabled={sundayChecked}
                            onChange={(evt) => {
                                if (sundayEnd1.slice(0, 2) <= evt.target.value.slice(0, 2)) {
                                    setSundayHelp1(true)
                                } else {
                                    setSundayHelp1(false)
                                }
                                setSundayStart1(`${evt.target.value}:00`)
                            }
                            }
                            required
                        /></Td>
                        <Td><TimePicker
                            aria-describedby="setSundayEnd1"
                            id="setSundayEnd1"
                            value={sundayEnd1.slice(0, 5)}
                            min={sundayStart1}
                            name="setSundayEnd1"
                            disabled={sundayChecked}
                            onChange={(evt) => {
                                if (sundayStart1.slice(0, 2) >= evt.target.value.slice(0, 2)) {
                                    setSundayHelp1(true)
                                } else { setSundayHelp1(false) }
                                if (sundayStart2.slice(0, 2) <= evt.target.value.slice(0, 2)) {
                                    setSundayHelp2(true)
                                } else {
                                    setSundayHelp2(false)
                                }
                                setSundayEnd1(`${evt.target.value}:00`)
                            }}
                            required
                        /></Td>
                        <Td><TimePicker
                            aria-describedby="setSundayStart2"
                            id="setSundayStart2"
                            value={sundayStart2.slice(0, 5)}
                            name="setSundayStart2"
                            disabled={sundayChecked}
                            onChange={(evt) => {
                                if (sundayEnd1.slice(0, 2) >= evt.target.value.slice(0, 2)) {
                                    setSundayHelp2(true)
                                } else {
                                    setSundayHelp2(false)
                                }
                                if (sundayEnd2.slice(0, 2) <= evt.target.value.slice(0, 2)) {
                                    setSundayHelp3(true)
                                } else {
                                    setSundayHelp3(false)
                                }
                                setSundayStart2(`${evt.target.value}:00`)
                            }}
                            required
                        /></Td>
                        <Td><TimePicker
                            aria-describedby="setSundayEnd2"
                            id="setSundayEnd2"
                            value={sundayEnd2.slice(0, 5)}
                            min={sundayStart2}
                            name="setSundayEnd2"
                            disabled={sundayChecked}
                            onChange={(evt) => {
                                console.log(sundayStart2.slice(0, 2) >= evt.target.value.slice(0, 2), (sundayStart2.slice(3, 5) >= evt.target.value.slice(3, 5)), sundayStart2.slice(3, 5), evt.target.value.slice(3, 5))
                                if ((sundayStart2.slice(0, 2) >= evt.target.value.slice(0, 2)) && (sundayStart2.slice(3, 5) >= evt.target.value.slice(3, 5))) {
                                    setSundayHelp3(true)
                                } else { setSundayHelp3(false) }
                                setSundayEnd2(`${evt.target.value}:00`)
                            }}
                            required
                        /></Td>
                        <Td textAlign='right'><Checkbox
                            id="sundayClosed"
                            value="sundayClosed"
                            name="sundayClosed"
                            checked={sundayChecked}
                            onChange={(event) => {
                                if (event.target.checked === true) {
                                    setSundayStart1("09:00:00")
                                    setSundayStart2("23:58:59")
                                    setSundayEnd1("17:00:00")
                                    setSundayEnd2("23:59:01")
                                    setSundayHelp1(false)
                                    setSundayHelp2(false)
                                    setSundayHelp3(false)
                                } else {
                                    if (sundayStart1.slice(0, 2) >= sundayEnd1.slice(0, 2)) {
                                        setSundayHelp1(true)
                                    }
                                    if (sundayStart2.slice(0, 2) <= sundayEnd1.slice(0, 2)) {
                                        setSundayHelp2(true)
                                    }
                                    if (sundayStart2.slice(0, 2) >= sundayEnd2.slice(0, 2)) {
                                        setSundayHelp3(true)
                                    }
                                }
                                setSundayChecked(event.target.checked);
                            }}
                        />
                        </Td>
                    </Tr>
                    {sundayHelp1 || sundayHelp2 || sundayHelp3 ?
                        <Tr>
                            <Td></Td>
                            <Td></Td>
                            {sundayHelp1 ?
                                <Td><HelpText variant="error">
                                    Select a time after the Start1 time.
                                </HelpText>
                                </Td>
                                : <Td></Td>}
                            {sundayHelp2 ?
                                <Td><HelpText variant="error">
                                    Select a time after the End1 time.
                                </HelpText>
                                </Td>
                                : <Td></Td>}
                            {sundayHelp3 ?
                                <Td><HelpText variant="error">
                                    Select a time after the Start2 time.
                                </HelpText>
                                </Td>
                                : <Td></Td>
                            }
                            <Td></Td>
                        </Tr> : null}
                </TBody>
                <TFoot>
                    <Tr>
                        <Td></Td>
                        <Td></Td>
                        <Td></Td>
                        <Td></Td>
                        <Td></Td>
                        <Td align='center'><Button variant="primary" onClick={saveTimes}>Save</Button>
                        </Td>
                    </Tr>
                </TFoot>
            </Table> : null}
            <Toaster left={['space180', 'unset', 'unset']} {...toaster} />
        </div>
    )
};