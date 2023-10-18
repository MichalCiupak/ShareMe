import React, {useState} from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import { client } from '../client';
import Spinner from './Spinner';
import { categories } from '../utils/data';
//categories


const CreatePin = ({user}) => {

  const [title, setTitle] = useState('');
  const [about, setAbout] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState(false);
  const [category, setCategory] = useState(null);
  const [imageAsset, setImageAsset] = useState(null);
  const [wrongImageType, setWrongImageType] = useState(false);

  const navigate = useNavigate();
  const uploadImage = (e) => {
    const {type, name} = e.target.files[0];

    if(type === 'image/png' || type === 'image/svg' || type === 'image/jpeg' || type === 'image/gif' || type === 'image/tiff'){
      setWrongImageType(false);
      setLoading(true);
      client.assets
        .upload('image', e.target.files[0], {contentType: type, filename: name})
        .then((document) => {
          setImageAsset(document);
          setLoading(false);
        })
        .catch((error) => {
          console.log('image upload error', error)
        })
      } else {
      setWrongImageType(true);
    }
  }

  const savePin = () => {
    if(title && about && destination && imageAsset?._id && category){
      const doc = {
        _type: 'pin',
        title,
        about,
        destination,
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageAsset?._id
          }
        },
        userId: user._id,
        postedBy: {
          _type: 'postedBy',
          _ref: user._id
        },
        category
      }
      client.create(doc)
        .then(() => {
          navigate('/')
        })
    } else {
      setFields(true);
      window.scrollTo(0,0);
      setTimeout(() => setFields(false), 2000);
      
    }
  }



  return (
    <div className='flex flex-col justify-center items-center mt-5 lg:h-4/5'>
      {fields && (
        <p className='text-red-500 mb-5 text-xl transition-all duration-150 ease-in'> 
          Please fill in all the fields.
        </p>
      )}
      <div className='flex lg:flex-row flex-col justify-left items-left bg-white lg:p-5 p-3 lg:w-4/5 w-full'>
        <div className='bg-secondaryColor bg-red-500 p-3 flex flex-0.7 w-full'>
          <div className='flex justify-center items-center flex-col border-2 border-dotted border-gray-300 p-3 w-full h-420'>
            {loading && <Spinner/>}
            {wrongImageType && <p>Wrong image type</p>}
            {!imageAsset ? (
              <lebel >
                <div className='flex flex-col items-center justify-center h-full'>
                  <div className='flex flex-col justify-center items-center'>
                    <p className='font-bold tet-2xl'>
                      <AiOutlineCloudUpload/>
                    </p>
                    <p className='text-lg'>Click to upload</p>

                  </div>
                  <p className='mt-32 text-gray-400'>
                    Recommendation: use high-quality JPG, SVG, PNG, GIF files.
                  </p>
                </div>
                <input 
                type='file'
                name='upload-image'
                onChange={uploadImage}
                className=''
                />

      
              </lebel>
            ) : (
              <div className='relative h-full'>
                <img src={imageAsset?.url} alt='uploaded-pic' className='h-full w-full'/>
                <button type='button' 
                className='absolute bottom-3 right-3 p-3 rounded-full bg0white text-xl cursoer-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out'
                onClick={() => setImageAsset(null)}
                >
                  <MdDelete/>
                </button>
              </div>
            )}
          </div>
        </div>
        <div className='flex flex-1 flex-col gap-6 lg:pl-5 mt-5'>
            <input  type='text'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='Add your title here'
            className='outline-none text-xl sm:text-xl font-bold border-b-2 border-gray-200 p-2'
            />
            {user && (
              <div className='flex gap-2 my-8 items-center justify-left bg-white rounded-lg'>
                <img src={user.image}
                className='w-10 h-10 rounded-full'
                alt='user-profile'
                />
                <p className='font-bold'>{user.userName}</p>
              </div>
            )}
            <input  type='text'
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder='What is your pin about?'
            className='outline-none my-8 text-xl sm:text-xl font-bold border-b-2 border-gray-200 p-2'
            />
            <input  type='text'
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder='Add a destination link'
            className='outline-none my-8 text-xl sm:text-xl font-bold border-b-2 border-gray-200 p-2'
            />
            <div className='flex flex-col'>
              <div>
                <p className='mb-2 my-8 font-semibold text-lg sm:text-xl'>
                  Choose Pin Category
                </p>
                <select onChange={(e) => setCategory(e.target.value)}
                className='appearance-none text-gray-700 outline-none w-3/5 text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer'>
                  <option value="other" className='bg-white'>Select category</option>
                  {categories.map((category) => (
                    <option className='font-bold border-0 outline-none capitalize bg-white text-gray-700'
                    value={category.name}>{category.name}</option>
                  ))}
                </select>
              </div>
              <div className='flex justify-end items-end mt-5'>
                <button type='button' onClick={savePin}
                className='bg-red-500 text-white font-bold p-2 rounded-full w-28 outline-none'>
                  Save Pin
                </button>
              </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePin
