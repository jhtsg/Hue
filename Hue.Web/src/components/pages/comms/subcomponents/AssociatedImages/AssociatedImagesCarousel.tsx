import { useEffect, useRef, useState } from "react";
import { commAssociatedImage, createCommissionAssociatedImage, deleteCommissionAssociatedImage, getCommissionAssociatedImages } from "../../../../../api/CommImg"
import useApi from "../../../../hooks/useApi";
import useUpload from "../../../../hooks/useUpload"
import CommissionAssociatedImage from "../../../../../model/commission/CommissionAssociatedImage";
import { Button, Card, CardActionArea, Dialog, DialogContent, DialogTitle, IconButton, TextField } from "@mui/material";
import { AddCircleOutline, ChevronLeft, ChevronRight, Delete, Upload } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import AreYouSureModal from "../../../../shared/modals/AreYouSureModal";

export default function AssociatedImagesCarousel(props: {
    commId: number,
    type: "REFERENCE" | "POST"
}) {

    const { commId, type } = props

    const uploadApi = useUpload(createCommissionAssociatedImage);
    const deleteApi = useApi(deleteCommissionAssociatedImage);
    const imagesApi = useApi(getCommissionAssociatedImages)

    const { enqueueSnackbar } = useSnackbar();

    const [image, setImage] = useState(undefined as undefined | CommissionAssociatedImage)
    const [newOpen, setNewOpen] = useState(false)
    const [viewOpen, setViewOpen] = useState(false)

    const title = type.charAt(0) + type.toLowerCase().substring(1);

    const currentImageIndex = () => {
        if (!image || !imagesApi.data) return -1;
        return imagesApi.data.map(a => a.id).indexOf(image.id)
    }

    const refresh = (onSuccess?: (val: CommissionAssociatedImage[] | undefined) => void) => {
        imagesApi.fetch(onSuccess, undefined, commId, type === 'REFERENCE' ? 0 : 1)
    }

    const onCreate = (file: File, notes: string) => {
        setNewOpen(false)
        enqueueSnackbar('Uploading...', { variant: 'info' })
        uploadApi.fetch("", () => {
            enqueueSnackbar('Attached Image!', { variant: 'success' })
            refresh();
        }, undefined, file, {
            type: type === 'REFERENCE' ? 0 : 1,
            notes: notes,
            commId: commId,
        })
    }

    const onDelete = () => {

        if (!image) return;
        if (!imagesApi.data) return;
        const index = currentImageIndex()
        if (index === -1) {
            console.error("waos")
            return;
        }

        deleteApi.fetch(() => {
            enqueueSnackbar('Deleted Image!', { variant: 'success' })
            refresh((val) => {
                if (!val || val.length === 0) {
                    setViewOpen(false)
                    setImage(undefined)
                    return;
                }
                setImage(val[Math.min(val.length - 1, index)])
            })
        }, undefined, image?.id)
    }

    useEffect(() => {
        refresh();
    }, [commId])

    return <>
        <div style={{ marginBottom: "10px", display: 'flex', justifyContent: 'space-between' }}>
            <div>{title} Images</div>
        </div>
        <div style={{ display: "flex", overflowX: "auto", gap: "10px", height: '230px', paddingBottom: "10px" }}>
            {imagesApi.data?.map(a => <>
                <AssociatedImageCard image={a} onClick={() => {
                    setImage(a);
                    setViewOpen(true);
                }} />
            </>)}
            <Card style={{ flex: '0 0 auto' }}>
                <CardActionArea onClick={() => setNewOpen(true)} style={{
                    width: "200px", height: "230px",
                    display: 'flex', flexDirection: "column", gap: "10px",
                    alignItems: 'center', justifyContent: 'center'
                }}>
                    <AddCircleOutline />
                    <div>Add an Image</div>
                </CardActionArea>
            </Card>
        </div>

        <AssociateImageCreator open={newOpen} setOpen={setNewOpen} onOk={onCreate} />
        {image && <AssociateImageViewer
            open={viewOpen} setOpen={setViewOpen}
            image={image} index={currentImageIndex()}
            onLeft={() => setImage(imagesApi.data[currentImageIndex() - 1])}
            onRight={() => setImage(imagesApi.data[currentImageIndex() + 1])}
            length={imagesApi.data?.length}
            deleteSelf={onDelete}
        />}
    </>

}

function AssociatedImageCard(props: {
    image: CommissionAssociatedImage
    onClick: () => void
}) {

    const { image, onClick } = props;

    return <Card style={{ width: "200px", flex: '0 0 auto' }}>
        <CardActionArea onClick={onClick}>
            <img src={commAssociatedImage(image.id)} style={{ width: "200px", height: "150px", objectFit: 'cover' }} />
            <div style={{ padding: "20px" }}>
                <div style={{
                    WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical',
                    fontSize: ".9em", overflow: 'hidden', textOverflow: 'ellipsis', height: "30px"
                }}>
                    {image.notes}
                </div>
            </div>
        </CardActionArea>
    </Card>
}

function AssociateImageCreator(props: {
    open: boolean,
    setOpen: (val: boolean) => void
    onOk: (file: File, notes: string) => void
}) {

    const { open, setOpen, onOk } = props;

    const fileInputRef = useRef(null);

    const [file, setFile] = useState(undefined as undefined | File)
    const [fileUrl, setFileUrl] = useState(undefined as string | undefined)
    const [note, setNote] = useState("")

    useEffect(() => {
        if (open) {
            setFile(undefined)
            setFileUrl(undefined)
            setNote("")
        }
    }, [open])

    const onSave = () => {
        if (!file) return;
        onOk(file, note)
    }


    return <>
        {
            open && <input
                type="file"
                accept="image/*" // Restrict file types to images only
                onChange={(e) => {
                    if (e.target.files) {
                        setFile(e.target.files[0])
                        setFileUrl(URL.createObjectURL(e.target.files[0]))
                    }
                }}
                ref={fileInputRef}
                style={{ display: 'none' }}
            />
        }

        <Dialog open={open} onClose={() => setOpen(false)} maxWidth='sm' fullWidth>
            <DialogTitle>Attach an Image</DialogTitle>
            <DialogContent>
                {fileUrl
                    ? <img style={{ width: "100%", height: "50vh", objectFit: 'contain' }} src={fileUrl} alt={'Selected image'} />
                    : <div style={{ width: "100%", height: "50vh", display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <Button variant="contained" onClick={() => { (fileInputRef?.current as any)?.click(); }} startIcon={<Upload />}>Select a File</Button>
                    </div>
                }

                <TextField label='Notes' value={note} onChange={(e) => setNote(e.target.value)} fullWidth multiline minRows={2} style={{ marginTop: "20px", marginBottom: '20px' }} />

                <div style={{ display: "flex", justifyContent: 'flex-end', gap: '10px' }}>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={() => onSave()} disabled={!file}>OK</Button>
                </div>
            </DialogContent>
        </Dialog>
    </>

}

function AssociateImageViewer(props: {
    open: boolean,
    setOpen: (val: boolean) => void
    image: CommissionAssociatedImage
    deleteSelf: () => void,
    index: number
    length: number
    onLeft: () => void,
    onRight: () => void,
}) {

    const { open, setOpen, image, deleteSelf, index, onLeft, onRight, length } = props;
    const [ays, setAys] = useState(false)

    return <>
        <Dialog open={open} onClose={() => setOpen(false)} maxWidth='sm' fullWidth>
            <DialogTitle style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <IconButton onClick={() => setAys(true)}><Delete /></IconButton>
                <div>Image {index + 1}/{length}</div>
            </DialogTitle>
            <DialogContent style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <IconButton disabled={index === 0} onClick={onLeft}><ChevronLeft /></IconButton>
                <div style={{ flex: "1" }}>
                    <img style={{ width: "100%", height: "50vh", objectFit: 'contain' }} src={commAssociatedImage(image.id)} alt={'Selected image'} />
                    <hr />
                    <div style={{ padding: "20px 0px" }}>
                        {image.notes}
                    </div>
                </div>
                <IconButton disabled={index === length - 1} onClick={onRight}><ChevronRight /></IconButton>
            </DialogContent>
        </Dialog>
        <AreYouSureModal open={ays} setOpen={setAys} onYes={() => {
            deleteSelf();
            setAys(false)
        }}>
            <div>Delete this image?</div>
        </AreYouSureModal>
    </>

}