import { useEffect, useState } from 'react';
import { FaFileImage } from 'react-icons/fa';
import Image from 'next/image';

function FileIcon({ fileType }) {

    const [img, setImg] = useState(null);

    const importImg = async (imgType) => {
      try{
        let image = await import(`./Icons/${imgType}.png`)
        setImg(image.default)
      }catch(err){
        let image = await import(`./Icons/doc.png`)
        setImg(image.default)
      }
    }

    useEffect(() => {
        importImg(fileType)
    }, [fileType]);

    if (img) {
        return (
            <Image src={img} alt={fileType} width={54} height={44} objectFit="contain" />
        );
    }

    return <FaFileImage />;
}

export default FileIcon;