import styles from './File.module.scss';
import {useState} from 'react';

interface Props {
    uploadLabel?: string,
    callback?: (blob: any[]) => void;
}

const File = ({callback, uploadLabel}: Props) => {

    const [preview, setPreview] = useState<string[]>([]);

    const [imagesData, setImagesData] = useState<string[]>([])

    const onChangeFile = async (e: any): Promise<void> => {
        e.preventDefault();
        const file = e.target.files ? e.target.files : e.dataTransfer.files;

        for(let i = 0; i < file.length; i++) {
            const objectUrl = URL.createObjectURL(file[i]);
            setPreview(preview => [...preview, objectUrl]);
            setImagesData(state => ([...state, file[i]]));
        };
    };

    const onRemoveFile = (index: number): void => {
        const clonePreview = [...preview];
        clonePreview.splice(index, 1);
        setPreview(clonePreview);
    };

    const onCallback = () => {
        setPreview([]);
        setImagesData([]);
        if(callback) callback(imagesData)
    };

    return (
        <div className={styles.container}>

            <div className={styles.upload} onDragOver={(e) => e.preventDefault()} onDrop={onChangeFile}>
                <label htmlFor="myfile">Upload images <br/> or <br/> drag and drop</label>
                <input type="file" id="myfile" accept='image/*' className={styles.inputFile} onChange={onChangeFile}/>
            </div>

            <div className={styles.preview}>
                {preview.map((img, index) => 
                    <button key={index} onClick={() => onRemoveFile(index)}>
                        <img src={img} alt="preview"/>
                    </button> 
                )}
            </div>

            {callback && !!imagesData.length &&
                <button className={styles.uploadBtn} onClick={onCallback}>
                    { uploadLabel || "Upload"}
                </button>
            }

        </div>
    )
}

export default File