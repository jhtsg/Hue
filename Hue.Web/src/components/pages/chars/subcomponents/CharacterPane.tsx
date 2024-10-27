import { Box, Button, CircularProgress, FormControl, InputLabel, MenuItem, Select, Skeleton, TextField } from "@mui/material"
import SafeAvatar from "../../../shared/SafeAvatar"
import useApi from "../../../hooks/useApi"
import useUpload from "../../../hooks/useUpload"
import { useEffect, useRef, useState } from "react"
import ApiAlert from "../../../shared/ApiAlert"
import { useSnackbar } from "notistack"
import { createCharacterCategory, getCharacterCategories, updateCharacterCategory } from "../../../../api/CharCategory"
import CharacterCategory from "../../../../model/character/CharacterCategory"
import Character from "../../../../model/character/Character"
import { characterImage, createCharacter, getCharacter, updateCharacter, updateCharacterProfile } from "../../../../api/Char"
import CharacterCategoryPill from "./CharacterCategoryPill"
import CharacterCategoryEditorModal from "./CharacterCategoryEditorModal"
import ColorBox from "../../../shared/ColorBox"
import { useWindowDimensions } from "../../../hooks/useWindowDimensions"

export default function CharacterPane(props: {
    create?: boolean,
    editable?: boolean,
    id?: number
    open?: boolean
    setOpen?: (val: boolean) => void
    onOk?: () => void
}) {

    const { id, create, editable, onOk } = props

    const { enqueueSnackbar } = useSnackbar();
    const { width } = useWindowDimensions();
    const vertical = width < 700
    const ultraVertical = width < 500

    const [editMode, setEditMode] = useState(create)

    const [name, setName] = useState("")
    const [species, setSpecies] = useState("")
    const [description, setDescription] = useState("")
    const [color, setColor] = useState("")

    const [catOpen, setCatOpen] = useState(false)
    const [newCatOpen, setNewCatOpen] = useState(false)

    const [category, setCategory] = useState(undefined as CharacterCategory | undefined)
    const [newCat, setNewCat] = useState(false)

    const [selectedFile, setSelectedFile] = useState(null as File | null)
    const [selectedFileUrl, setSelectedFileUrl] = useState(undefined as string | undefined)

    const characterApi = useApi(getCharacter)
    const characterCategoriesApi = useApi(getCharacterCategories, editable || create)

    const createCharacterCategoryApi = useApi(createCharacterCategory)
    const updateCharacterCategoryApi = useApi(updateCharacterCategory)

    const updateCharacterApi = useApi(updateCharacter);
    const createCharacterApi = useApi(createCharacter)
    const updateCharacterProfileApi = useUpload(updateCharacterProfile)

    const fileInputRef = useRef(null);

    const refreshCharacterCategories = () => {
        characterCategoriesApi.fetch()
    }

    const refreshCharacters = () => {
        characterApi.fetch(undefined, undefined, id)
    }

    useEffect(() => {
        if (id) {
            refreshCharacters();
        }
    }, [id]);

    useEffect(() => {
        setName("")
        setSpecies("")
        setDescription("");
        setColor("")
        setCategory(undefined)
        setNewCat(false)
        setSelectedFile(null)
        characterApi.resetError()
        updateCharacterApi.resetError();
        createCharacterApi.resetError();
        updateCharacterProfileApi.resetError();
        updateCharacterCategoryApi.resetError();
        createCharacterCategoryApi.resetError();

    }, [props.open])

    const handleActionClick = () => {
        if (!editMode) {
            setName(characterApi.data?.name)
            setSpecies(characterApi.data?.species)
            setDescription(characterApi.data?.description);
            setColor(characterApi.data?.color)
            setCategory(characterApi.data?.category)
            setNewCat(false)
            setSelectedFile(null)
            setEditMode(true)
            characterApi.resetError()
            updateCharacterApi.resetError();
            createCharacterApi.resetError();
            updateCharacterProfileApi.resetError();
            updateCharacterCategoryApi.resetError();
            createCharacterCategoryApi.resetError();
            return;
        }

        if (newCat) {
            createCharacterCategoryApi.fetch(
                create ? createChar : updateChar
                , undefined, category)
        } else {
            if (create) { createChar() }
            else { updateChar() }
        }

    }

    const createChar = (catOverride?: CharacterCategory) => {

        if (!catOverride && !category) {
            enqueueSnackbar("Please specify a category", { variant: 'warning' })
            return;
        }

        createCharacterApi.fetch(onCreateSuccess, undefined, {
            name: name,
            color: color,
            description: description,
            species: species,
            category: catOverride ?? category
        } as Character)
    }

    const updateChar = (catOverride?: CharacterCategory) => {
        updateCharacterApi.fetch(onUpdateSuccess, undefined, {
            id: id,
            name: name,
            color: color,
            description: description,
            species: species,
            category: catOverride ?? category
        } as Character)
    }

    const onCreateSuccess = (val?: Character) => {
        if (selectedFile) {
            updateCharacterProfileApi.fetch(characterImage(val?.id ?? 0), onUploadCreateSuccess, undefined, val?.id, selectedFile)
        } else {
            enqueueSnackbar("Character created!", { variant: 'success' })
            if (onOk) onOk();
        }
    }

    const onUpdateSuccess = () => {
        if (onOk) onOk();
        refreshCharacters();
        if (selectedFile) {
            updateCharacterProfileApi.fetch(characterImage(id ?? 0), onUploadSuccess, undefined, id, selectedFile)
        } else {
            setEditMode(false)
            enqueueSnackbar("Character Updated!", { variant: 'success' })
        }
    }

    const onUploadCreateSuccess = () => {
        if (selectedFileUrl) { URL.revokeObjectURL(selectedFileUrl) }
        setSelectedFile(null)
        enqueueSnackbar("Character Created!", { variant: 'success' })
        if (onOk) onOk();
    }

    const onUploadSuccess = () => {
        if (selectedFileUrl) { URL.revokeObjectURL(selectedFileUrl) }
        setSelectedFile(null)
        setEditMode(false)
        enqueueSnackbar("Character Updated!", { variant: 'success' })
    }

    const updateCategory = (val: CharacterCategory) => {
        setCategory(val)
        setNewCat(false)
    }


    const anyLoading = characterApi.loading || updateCharacterApi.loading || createCharacterApi.loading || updateCharacterProfileApi.loading || characterCategoriesApi.loading || createCharacterApi.loading

    return <>

        <input
            type="file"
            accept="image/*" // Restrict file types to images only
            onChange={(e) => {
                if (e.target.files) {
                    setSelectedFile(e.target.files[0])
                    setSelectedFileUrl(URL.createObjectURL(e.target.files[0]))
                }
            }}
            ref={fileInputRef}
            style={{ display: 'none' }}
        />

        <ApiAlert result={characterApi.error} style={{ marginBottom: "20px" }} />
        <ApiAlert result={updateCharacterApi.error} style={{ marginBottom: "20px" }} />
        <ApiAlert result={createCharacterApi.error} style={{ marginBottom: "20px" }} />
        <ApiAlert result={updateCharacterProfileApi.error} style={{ marginBottom: "20px" }} />

        <div style={{ width: "100%", display: "flex", flexDirection: ultraVertical ? 'column' : undefined }}>
            <div style={ultraVertical ? { width: "128", margin: "0px auto 20px auto", textAlign: "center" } : { marginRight: "20px", textAlign: 'center' }}>
                <SafeAvatar size={128} src={
                    selectedFile ? selectedFileUrl : characterImage(id ?? 0)
                } text={"?"} hasImage={!create} />
                {editMode && <Button style={{ marginTop: "10px" }} onClick={() => { (fileInputRef?.current as any)?.click(); }}>Change</Button>}
            </div>
            <div style={{ flex: "1", display: "flex", flexDirection: "column" }}>
                <div style={{ flex: "1" }}>
                    {editMode ? <>
                        <div style={{ marginBottom: "20px", display: vertical ? undefined : "flex", width: "100%" }}>
                            <div style={{ flex: "1" }}>
                                <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
                            </div>
                            <div style={vertical ? { marginTop: "20px" } : { width: "200px", marginLeft: "20px" }}>
                                <ColorBox color={color} setColor={setColor} />
                            </div>
                        </div>
                        <div style={{ marginBottom: "20px", display: vertical ? undefined : "flex", width: "100%" }}>
                            <div style={vertical ? { marginBottom: "20px" } : { width: "200px", marginRight: "20px" }}>
                                <FormControl fullWidth>
                                    <InputLabel id="categorySelectLabel">Category</InputLabel>
                                    <Select labelId="categorySelectLabel" value={category?.id} label="Category">
                                        <MenuItem value={-1} onClick={() => setNewCatOpen(true)}>
                                            <div style={{ display: "flex", width: "100%" }}>
                                                <div style={{ backgroundColor: newCat ? category?.color : '#999', width: "10px", marginRight: "10px" }} />
                                                <div style={{ flex: "1" }}>
                                                    {newCat ? category?.name : 'Create new'}
                                                </div>
                                            </div>
                                        </MenuItem>
                                        {characterCategoriesApi.data?.map(cat => <MenuItem value={cat.id} onClick={() => updateCategory(cat)}>
                                            <div style={{ display: "flex", width: "100%" }}>
                                                <div style={{ backgroundColor: cat.color, width: "10px", marginRight: "10px" }} />
                                                <div style={{ flex: "1" }}>{cat.name}</div>
                                            </div>
                                        </MenuItem>)}
                                    </Select>
                                </FormControl>
                            </div>
                            <div style={{ flex: "1" }}>
                                <TextField label="Species" value={species}
                                    onChange={(e) => setSpecies(e.target.value)} fullWidth
                                />
                            </div>
                        </div>
                        <div style={{}}>
                            <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth multiline minRows={5} />
                        </div>
                    </> :
                        characterApi.data ? <>
                            <div style={{ padding: "5px", backgroundColor: characterApi.data?.color, borderRadius: "5px" }} />
                            <div style={{ fontSize: "2em", marginBottom: "2px" }}>
                                {characterApi.data.name}
                            </div>
                            <div style={{ display: "flex", alignItems: "center" }}>
                                {characterApi.data.category && <Box style={{ marginRight: "10px", cursor: "pointer" }} onClick={() => setCatOpen(true)}>
                                    <CharacterCategoryPill category={characterApi.data.category} />
                                </Box>}
                                <div style={{ fontSize: ".8em", color: "#999999" }}>{characterApi.data.species}</div>
                            </div>
                            <hr />
                            <div>{characterApi.data.description}</div>

                        </> :
                            <>
                                <Skeleton variant="text" sx={{ fontSize: '2em' }} animation='wave' />
                                <Skeleton variant="text" sx={{ fontSize: '.8em' }} animation='wave' />
                                <hr />
                                <Skeleton variant="rounded" sx={{ width: '100%', height: '100px' }} animation='wave' />
                            </>
                    }
                </div>
                {(editable || editMode) && <div style={{ display: "flex", flexDirection: "row-reverse", marginTop: "20px" }}>
                    <Button onClick={handleActionClick} disabled={anyLoading}>
                        {anyLoading ? <CircularProgress size={25} /> : editMode ? "OK" : "Edit"}
                    </Button>
                    {editMode && !anyLoading && <Button
                        style={{ marginRight: "20px" }}
                        onClick={() => {
                            if (create && props.setOpen) { props.setOpen(false) }
                            else { setEditMode(false) }
                        }}
                    >
                        Cancel
                    </Button>}
                </div>}
            </div>
        </div>

        {/* I know its weird that we have two of them but don't worry about it */}

        {/* This one is to edit the new one */}
        <CharacterCategoryEditorModal open={newCatOpen} onCancel={() => setNewCatOpen(false)} onOk={(val: CharacterCategory) => {
            setCategory({ ...val, id: -1 });
            setNewCatOpen(false)
            setNewCat(true)
        }} />


        {/* This one is to edit an existing one */}
        <CharacterCategoryEditorModal open={catOpen} category={characterApi.data?.category} onCancel={() => setCatOpen(false)} onOk={(val: CharacterCategory) => {
            updateCharacterCategoryApi.fetch(() => {
                refreshCharacterCategories();
                refreshCharacters();
                setCatOpen(false)
            }, undefined, val)
        }} />
    </>
}