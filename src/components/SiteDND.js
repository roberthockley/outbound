import { Combobox } from '@twilio-paste/core/combobox';
import React, { useEffect } from 'react';
import { Label, Box } from '@twilio-paste/core';
import { useToaster, Toaster } from '@twilio-paste/core/toast';
import { Heading } from '@twilio-paste/core/heading';
import { Button } from '@twilio-paste/core/button';
import { Input } from '@twilio-paste/core/input';
import { Modal, ModalBody, ModalFooter, ModalFooterActions, ModalHeader, ModalHeading } from '@twilio-paste/core/modal';
import { useUID } from '@twilio-paste/core/uid-library';
import ReactFileReader from 'react-file-reader';
import { Spinner } from '@twilio-paste/core/spinner';
import { Table, THead, Tr, Td, Th, TBody } from '@twilio-paste/core/table';
import { DeleteIcon } from "@twilio-paste/icons/esm/DeleteIcon";
import axios from 'axios';

const moment = require('moment');

let newData = []
let listDND = []
let numberRanges = [
    ["All"]
];

export const SiteDND = () => {
    const [listName, setListName] = React.useState('');
    const [list, setList] = React.useState(newData);
    const [siteList, setSiteList] = React.useState("");
    const [inputItems, setInputItems] = React.useState(newData);
    const [value, setValue] = React.useState();
    const [inputNumber, setInputNumber] = React.useState();
    const [dnd, setDND] = React.useState(listDND);
    const [showResults, setShowResults] = React.useState(false);
    const [numberData, setNumberData] = React.useState([])
    const [filteredDND, setFilteredDND] = React.useState(listDND)
    const [isModalOpen, setModalOpen] = React.useState(false);
    const [fileData, setFileData] = React.useState("");
    const [filterDateRange, setFilterDateRange] = React.useState(numberRanges);
    const [filter, setFilter] = React.useState("All");
    const [dynamoDND, setDynamoDND] = React.useState("");
    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);
    const toaster = useToaster();
    const [showListDetails, setShowListDetails] = React.useState(true);
    const [showFoundListDetails, setShowFoundListDetails] = React.useState(true);
    let handleFormSubmit; //=console.log("Submit")
    let dndToList = [];
    let dnd2 = JSON.parse(localStorage.getItem('dnd'));
    let items;

    const fetchListDND = (list) => {
        console.log("PPP",list)
        dnd2 = JSON.parse(localStorage.getItem('dnd'))
        numberRanges = [
            ["All"]
        ];
        for (let i = 0; i < dnd2.length; i++) {
            console.log(dnd2[i], list)
            if (dnd2[i].list === list) {
                items = dnd2[i].dnds;
            }
        }
        for (let i = 0; i < items.length; i++) {
            let numbers = {}
            numbers.number = items[i].number
            numbers.name = items[i].name
            dndToList.push(numbers)
        }
        /*dndToList.sort((a, b) => {
            const numberA = moment(a.number, "DD/MM/YYYY").toDate();
            const numberB = moment(b.number, "DD/MM/YYYY").toDate();
            return numberA - numberB;
        });*/

        setNumberData(dndToList)
        setDND(dndToList)

        setFilteredDND(dndToList.sort())
        setFilter("All")

    }

    const removeNumber = (number, name, list) => {
        console.log(`****** Remove Number ${list}`, number, name)
        let numberToUpdate;
        let listDND = []
        for (let i = 0; i < dynamoDND.length; i++) {
            if (dynamoDND[i].list === list) {
                for (let j = 0; j < dynamoDND[i].dnds.length; j++) {
                    console.log(dynamoDND[i].dnds[j])

                    if (dynamoDND[i].dnds[j].number == number) {
                    } else {
                        listDND.push(dynamoDND[i].dnds[j])
                        //listPrompts.push(dynamoPrompts[i].prompts[j])
                    }


                }
                dynamoDND[i].dnds = listDND
                console.log("update", listDND)

            }
        }
        localStorage.setItem('dnd', JSON.stringify(dynamoDND));
        fetchListDND(list)
        toaster.push({
            message: 'Number removed',
            variant: 'warning',
            dismissAfter: 3000
        })
    }

    const AddNumberModal = (prop) => {
        const uidDP = useUID();
        const uidHT = useUID();
        let list = prop.list
        const [isOpen, setIsOpen] = React.useState(false);
        const handleOpen = () => {
            if (list.length === 0) {
                toaster.push({
                    message: 'Select List first',
                    variant: 'error',
                    dismissAfter: 3000
                })
                setIsOpen(false)
                console.log("List not set - Modal closed!")
            } else {
                setIsOpen(true)
                console.log("Modal Open");
            }
        }
        const handleClose = () => {
            setIsOpen(false)
            console.log("Modal closed")
        };

        const addNumber = () => {
            console.log("HD", numberData)
            if (!number) {
                toaster.push({
                    message: 'Select a number first',
                    variant: 'error',
                    dismissAfter: 3000
                })
                setIsOpen(false);
            } else {
                let numberToAdd = {}
                numberToAdd.number = number;
                numberToAdd.name = name;
                console.log(dnd)
                listDND = dnd
                listDND.push(numberToAdd)
                for (let i = 0; i < dynamoDND.length; i++) {
                    if (dynamoDND[i].list === list) {

                        dynamoDND[i].dnds = listDND
                        console.log("update", listDND)

                    }
                }
                console.log("PPPPPP", dynamoDND, listDND)
                localStorage.setItem('dnd', JSON.stringify(dynamoDND));
                fetchListDND(list)
                setIsOpen(false);
                toaster.push({
                    message: 'Number added',
                    variant: 'success',
                    dismissAfter: 3000
                })

            }
        };

        const modalHeadingID = useUID();
        const nameInputRef = React.createRef();
        const numberInputRef = React.createRef();
        const [number, setNumber] = React.useState('');
        const [name, setName] = React.useState('');
        return (
            <div>
                <Button variant="primary" onClick={handleOpen}>
                    New Number
                </Button>
                <Modal ariaLabelledby={modalHeadingID} isOpen={isOpen} onDismiss={handleClose} size="default">
                    <ModalHeader>
                        <ModalHeading as="h3" id={modalHeadingID}>
                            New Number
                        </ModalHeading>
                    </ModalHeader>
                    <ModalBody>
                        <Label htmlFor={uidDP + 2} required>
                        </Label>
                        <Label>Customer Number</Label>
                        <Input
                            type="text"
                            id={modalHeadingID + 2}
                            onChange={e => setNumber(e.currentTarget.value)}
                        />
                        <Label htmlFor={uidDP} required>
                        </Label>
                        <Label>Customer Name</Label>
                        <Input
                            type="text"
                            id={modalHeadingID}
                            onChange={e => setName(e.currentTarget.value)}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <ModalFooterActions>
                            <Button variant="secondary" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button variant="primary" onClick={addNumber}>Submit</Button>
                        </ModalFooterActions>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }

    const AddListModal = (prop) => {
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
        const addList = () => {
            if (list.indexOf(listName) !== -1) {
                console.log("-1")
                toaster.push({
                    message: 'List Name already Exists',
                    variant: 'error',
                    dismissAfter: 3000
                })
            } else {
                let updatedDrop = list
                updatedDrop.push(listName)
                setList(updatedDrop)
                setInputItems(updatedDrop)
                setSiteList(listName);
                setIsOpen(false)
                let update = {}
                update.list = listName;
                update.dnds = [];
                dynamoDND.push(update)
                localStorage.setItem('dnd', JSON.stringify(dynamoDND));
                fetchListDND(listName)
            }
        }
        const modalHeadingID = useUID();
        const nameInputRef = React.createRef();
        const dateInputRef = React.createRef();
        const [listName, setListName] = React.useState('');
        return (
            <div>
                <Button variant="primary" onClick={handleOpen}>
                    New List
                </Button>
                <Modal ariaLabelledby={modalHeadingID} isOpen={isOpen} onDismiss={handleClose} size="default">
                    <ModalHeader>
                        <ModalHeading as="h3" id={modalHeadingID}>
                            New Do Not Call List
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
                            <Button variant="primary" onClick={addList}>Submit</Button>
                        </ModalFooterActions>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }

    const AddFileModal = (prop) => {
        const uidDP = useUID();
        const uidHT = useUID();
        let location = prop.location
        const [isOpen, setIsOpen] = React.useState(false);
        const [fileUploaded, setFileUploaded] = React.useState(false);
        const [fileData, setFileData] = React.useState(null);
    
        const handleOpen = () => {
            setIsOpen(true)
            setFileUploaded(false);
            console.log("Modal Open");
        }
    
        const handleClose = () => {
            setIsOpen(false)
            console.log("Modal closed")
        };
    
        const handleFiles = files => {
            console.log(siteList)
            if (!siteList) {
                toaster.push({
                    message: 'List Name Missing',
                    variant: 'error',
                    dismissAfter: 3000
                })
                return; // Exit the function if there's no siteList
            }
            let importFileData = files.base64[0].replace("data:text/csv;base64,", "")
            setFileData(importFileData)
            setFileUploaded(true);
            console.log(atob(importFileData))
        }
    
        const addFileList = (test) => {
            if (!fileData) {
                toaster.push({
                    message: 'No file uploaded',
                    variant: 'error',
                    dismissAfter: 3000
                })
                return;
            }
            let csvContent = atob(fileData)
            const lines = csvContent.split('\n').map(line => line.replace(/\r/g, ''));
            const dataWithoutHeader = lines.slice(1);
            const parsedData = dataWithoutHeader.map(line => {
                return line.split(','); // Adjust the delimiter if necessary
            });
            let update = {};
            update.list = siteList;
            let newData = [];
            for (let i = 0; i < parsedData.length; i++) {
                let item = {};
                item.number = parsedData[i][0]
                item.name = parsedData[i][1]
                newData.push(item)
            }
            update.dnds = newData
            let newListToUpdate=[]
            for (let i = 0; i < dynamoDND.length; i++) {
                if(dynamoDND[i].list === siteList){
                    newListToUpdate.push(update)
                }else{
                    newListToUpdate.push(dynamoDND[i])
                }
            }
            localStorage.setItem('dnd', JSON.stringify(newListToUpdate));
            console.log("LLLL",siteList)
            setDynamoDND(newListToUpdate)
            fetchListDND(siteList)
            handleClose(); // Close the modal after successful submission
        }
    
        const modalHeadingID = useUID();
        const nameInputRef = React.createRef();
        const dateInputRef = React.createRef();
        const [listName, setListName] = React.useState('');
    
        return (
            <div>
                <Button variant="primary" onClick={handleOpen}>
                    Upload
                </Button>
                <Modal ariaLabelledby={modalHeadingID} isOpen={isOpen} onDismiss={handleClose} size="default">
                    <ModalHeader>
                        <ModalHeading as="h3" id={modalHeadingID}>
                            New Do Not Call List
                        </ModalHeading>
                    </ModalHeader>
                    <ModalBody>
                        <span>
                            <Label>Select a CSV File</Label>
                            <ReactFileReader handleFiles={handleFiles} fileTypes={[".csv"]} base64={true} multipleFiles={true}>
                                <Button className='btn'>Upload</Button>
                            </ReactFileReader>
                        </span>
                        {fileUploaded && <p>File uploaded successfully!</p>}
                        <span>
                            {showResults ? <Heading as="h5" variant="heading50">Loading</Heading> : null}
                            {showResults ? <Spinner size="sizeIcon70" decorative={false} title="Loading" /> : null}
                        </span>
                    </ModalBody>
                    <ModalFooter>
                        <ModalFooterActions>
                            <Button variant="secondary" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button variant="primary" onClick={addFileList} disabled={!fileUploaded}>Submit</Button>
                        </ModalFooterActions>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
    

    const findList = (number) => {
        let foundList = []
        setShowListDetails(false)
        for (let i = 0; i < dynamoDND.length; i++) {
            for (let j = 0; j < dynamoDND[i].dnds.length; j++) {
                if (number === dynamoDND[i].dnds[j].number) {
                    foundList.push(dynamoDND[i].list)
                }
            }

        }
        setFilteredDND(foundList)
    }

    const loadList = (foundlist) => {
        setValue(foundlist)
        setInputNumber("")
        setShowListDetails(true)
        setInputItems(foundlist)
        setFilterDateRange(["All"])
        fetchListDND(foundlist)
    }

    const removeList = () => {
        if (siteList === "Global") {
            toaster.push({
                message: 'Global List Cannot Be Deleted',
                variant: 'error',
                dismissAfter: 3000
            })
        }
        console.log(siteList)
        if (siteList.length === 0) {
            toaster.push({
                message: 'Select List First',
                variant: 'error',
                dismissAfter: 3000
            })
        }
        let listsToUpdate = []
        let newList = []
        for (let i = 0; i < dynamoDND.length; i++) {
            console.log(dynamoDND[i].list, siteList)
            if (dynamoDND[i].list === siteList) {
                console.log(siteList, "found", i)
            } else {
                listsToUpdate.push(dynamoDND[i])
                newList.push(dynamoDND[i].list)
            }
        }
        setList(newList);
        setDynamoDND(listsToUpdate)
        setSiteList("Global")
        setInputItems("Global")
        fetchListDND("Global")
        localStorage.setItem('dnd', JSON.stringify(listsToUpdate));
    }

    useEffect(() => {
        setDynamoDND(JSON.parse(localStorage.getItem('dnd')))
        setNumberData([])
        setDND([])
        setFilteredDND([])
        numberRanges = [
            ["All"]
        ];
        let lists = []
        setList(lists);
        setNumberData(newData);
        console.log(`List(s) are: ${list}`)
        setFilterDateRange(numberRanges)
        for (let i = 0; i < dnd2.length; i++) {
            lists.push(dnd2[i].list)
        }
        setList(lists);

    }, []);

    return (
        <Box style={{ width: '50%' }}>
            <Heading as="h1" variant="heading10">
                Do Not Call Lists
            </Heading>

            {showListDetails ? <div><br />
                <div >
                    <div style={{ display: "flex", gap: "30px" }}>
                        <span>
                            <Combobox items={list} value={siteList} labelText="Select a List" required onInputValueChange={({ inputValue }) => {
                                setSiteList(inputValue);
                                setInputItems(inputValue)
                                setFilterDateRange(["All"])
                                fetchListDND(inputValue)
                            }} />
                        </span>
                        <span>
                            <Label>&zwnj;</Label>
                            <Button onClick={() => removeList(siteList)}>Delete</Button>
                        </span>
                        <span>
                            <Label>&zwnj;</Label>
                            <AddListModal
                                isModalOpen={isModalOpen}
                            //handleClose={closeModal}
                            //onSubmit={handleFormSubmit}
                            />
                        </span>
                        <span>
                            <Label>&zwnj;</Label>
                            <AddFileModal
                                isModalOpen={isModalOpen}
                            //handleClose={closeModal}
                            //onSubmit={handleFormSubmit}
                            />
                        </span>
                        <span>
                            <Label>Find lists containing:</Label>
                            <Input
                                value={inputNumber}
                                type="text"
                                id="newNumber"
                                onChange={e => {
                                    setFilter(e.currentTarget.value)
                                    setInputNumber(e.currentTarget.value)
                                }}
                            />
                        </span>
                        <span>
                            <Label>&zwnj;</Label>
                            <Button variant="primary" onClick={() => findList(filter)}>Find</Button>
                        </span>
                    </div>
                </div>
                <div><br /></div>
                <Table aria-label="number-grid" id="number-grid" striped="true" >
                    <THead stickyHeader top={0}>
                        <Tr>
                            <Th >Customer Number</Th>
                            <Th >Customer Name</Th>
                            <Th>
                                <AddNumberModal
                                    isModalOpen={isModalOpen}
                                    list={inputItems}
                                    handleClose={closeModal}
                                    onSubmit={handleFormSubmit}
                                />
                            </Th>
                        </Tr>
                    </THead>
                    <TBody>
                        {filteredDND.map((dndlist, index) => (
                            <Tr key={"row" + index}>
                                <Td key={"number" + index}>{dndlist.number}</Td>
                                <Td key={"name" + index}>{dndlist.name}</Td>
                                <Td key={"button" + index} textAlign='left'>
                                    <Button variant="secondary" textAlign='left' size="small" onClick={() => removeNumber(dndlist.number, dndlist.name, inputItems)}><DeleteIcon decorative={false} title="Delete" /></Button>
                                </Td>
                            </Tr>
                        ))}
                    </TBody>
                </Table>
            </div> : <div><br />
                <Table aria-label="number-grid" id="number-grid" striped="true" >
                    <THead stickyHeader top={0}>
                        <Tr>
                            <Th >List Name</Th>
                            <Th>
                            </Th>
                        </Tr>
                    </THead>
                    <TBody>
                        {filteredDND.map((foundlist, index) => (
                            <Tr key={"listrow" + index}>
                                <Td key={"list" + index}>{foundlist}</Td>
                                <Td key={"loadList" + index}><Button variant="primary" onClick={() => loadList(foundlist)}>Load</Button>
                                </Td>
                            </Tr>

                        ))}
                    </TBody>
                </Table>
            </div>}
            <Toaster left={['space180', 'unset', 'unset']} {...toaster} />
        </Box>
    )
};