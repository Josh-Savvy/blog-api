import React, { useEffect } from 'react'
import { useState, } from 'react'
import { useNavigate, NavLink } from 'react-router-dom';
import {Card, CardBody, CardHeader, CardFooter,Typography,Button, IconButton, Avatar, Popover,PopoverHandler,PopoverContent,} from "@material-tailwind/react";
import { ArrowRightIcon, ArrowLeftIcon} from "@heroicons/react/24/outline";  
import blog1Img from '../../Assets/Images/blog.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark, faComment, faHeart, faEllipsis, } from '@fortawesome/free-solid-svg-icons';
// import userAvatar from '../../Assets/Images/emma.jpg'
import { useDispatch, useSelector } from 'react-redux';
import { selectAllPosts } from '../redux/PostsSlice';
import {token} from '../redux/AccessTokenSlice'
import axios from 'axios';
import {toast, ToastContainer} from 'react-toastify'
import { user } from '../redux/UserDataSlice';
import { getPosts } from '../redux/PostSlice';

 

const Pagination =({totalPages, currentPage, setCurrentPage})=>{

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  }
  const handlePrevPage = ()=>{
    setCurrentPage(currentPage - 1)
  }
  const handleNextPage = ()=>{
    setCurrentPage(currentPage + 1)
  }
  
  return (
    <div className="mx-0 flex items-center gap-">
      <Button
        variant="text"
        color="blue-gray"
        className="flex items-center text-xs md:text-base"
        onClick={handlePrevPage}
        disabled={currentPage === 1}
      >
        <ArrowLeftIcon strokeWidth={2} className="h-2 w-2 md:h-6 md:w-7 " /> Previous
      </Button>
      <div className="flex items-center gap1 -mx-4">
    { Array.from({ length: totalPages }).map((_, index) =>(
        <IconButton key={index} size='sm' variant={`${index+1 ===currentPage ? 'filled' : 'text'}`} color={`${index+1 ===currentPage ? 'blue' : 'blue-gray'}`} className='px-0 mx-0 md:text-base' onClick={()=>handlePageChange(index+1)}>{index+1} </IconButton>
    ))
    }
    </div>
      <Button
        variant="text"
        color="blue-gray"
        className="flex items-center -p-0 mx-6 md:text-base"
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
      >
        Next
        <ArrowRightIcon strokeWidth={2} className="h-2 w-2 md:w-7 md:h-6" />
      </Button>
    </div>
    );
}

const Posts = ({ postFetched, isPending}) => {
  const userData = useSelector(user)
  const accessToken = useSelector(token)
  const dispatch = useDispatch()
  const notify =()=>toast("Post Deleted Successfully")

  let objectsPerPage
    if(postFetched && postFetched.length <4){
      objectsPerPage =2;
    }
    else if(postFetched && postFetched.length <10){
      objectsPerPage = 4
    }
    else if(postFetched && postFetched.length < 20){
      objectsPerPage = 5
    }
    else if(postFetched && postFetched.length < 30){
      objectsPerPage = 8
    }
  
    const [currentPage, setCurrentPage] = useState(1);  
    const totalPages =postFetched && Math.ceil(postFetched.length / objectsPerPage);

  const startIndex = (currentPage - 1) * objectsPerPage;
  const endIndex = startIndex + objectsPerPage;
 
  let currentObjects = postFetched && postFetched.slice(startIndex, endIndex); 

  const navigateTo = useNavigate()

  // const onReadMoreClick = (postId)=>{
  //   navigateTo(`/read-post-page/${postId}`)
  //   }
  
  const [likeState, setButtonState] = useState(false)
  const [bookmarkState, setBookmarkState] = useState(false)

  const handleLikeButton =(postId)=>{
    currentObjects.filter((obj)=>{
      if(postId ===obj.id){
        console.log(postId + ' is available')
        setButtonState(!likeState)
      }
    })
  }
  const handleBookmarkButton = ()=>{
    setBookmarkState(!bookmarkState)
  }
  
  const handleDeletePost =(postId)=>{
    const headers ={
      Authorization: `Bearer ${accessToken}`
    }
    axios.delete(`http://localhost:3000/post/${postId}`, {headers} )
    .then(function(response){
      if(response.statusText==='OK'){
        console.log("post deleted successfully")
        notify()
        console.log(response)
        dispatch(getPosts( postFetched.filter((obj)=>obj.id!==postId)))
    }
    })
    .catch(function(error){
      console.log(error)
    })
  }

  return (
    <div className='flex flex-col md:w-full bg-white md:mt-5 md:'>
      <div className='absolute top-0 '> 
        <ToastContainer/>
      </div>
        {/* <Cards/> */}
        { isPending ?
        <p className='text-sm text-center'>loading...</p>
        :postFetched ?
        <div className='flex flex-col divide-y divide-gray-300 md:w-full mx-2 md:gap-8 items-center '>
            {currentObjects.map((object)=>(
                <div key={object.id} className='flex flex-col pt-2 md:pt-4 w-full md:w-full'>
                    <div className='flex flex-col'>
                      <div className="flex justify-between w-full gap-2">
                          <div className="flex items-center justify-between">
                            <Avatar
                              size='sm'
                              variant='circular'
                              src={object.userAvatar} alt='user avatar'
                            />
                              <Typography variant="small" color="blue-gray" className='md:text-lg'>
                              {object.user.firstname} {object.user.lastname}
                              </Typography>
                          </div>
                          <div className=' items-center'>
                            <Typography variant='small' color='blue-gray' className='text-[8px] md:text-lg'>
                              {object.created_at}
                            </Typography>
                          </div>
                      </div>
                      <CardBody className='-mt-5 -mb-2 z-0'>
                        <NavLink to={`/read-post-page/${object.id}`}>
                          <div className='flex flex-row justify-between'>
                            <div className=''>
                              <Typography variant='h5' color='blue-gray' className=''>
                                  {object.title}
                              </Typography>
                            </div>
                            <img src={object.image} alt='card image' className=' w-auto h-auto md:w-30 md:h-40'/>
                          </div>
                          <div className='hidden md:flex md:flex-col md:-mt-32'>
                            <p>{object.content.substr(0, 200)}...</p>
                          </div>
                        </NavLink>
                      </CardBody>
                      <CardFooter className='flex flex-row -mt-10 -mb-6 z-0 md:-mt-9 md:justify-between'>
                          <Typography className="font-normal text-[10px] md:text-sm">
                              {object.date}
                          </Typography>
                          <Typography variant='lead' className='bg-blue-gray-50 text-gray-500 text-xs px-2 py-1'>
                              {object.category}
                          </Typography>
                      </CardFooter>
                      <CardFooter className='-mb-3 z-0 '>
                          <div className='flex justify-between gap-2 text-xs -mt-6 md:-mt-3'>
                              <button onClick={()=>handleLikeButton(object.id)}>
                                  <FontAwesomeIcon icon={faHeart} className={`${likeState && 'text-red-600'}`}/> <span>{object.PostLikes}</span>
                              </button>
                              <button>
                                  <FontAwesomeIcon icon={faComment}/> <span>{object.PostComments}</span>
                              </button>
                              <button onClick={handleBookmarkButton}>
                                  <FontAwesomeIcon icon={faBookmark} className={`${bookmarkState && 'text-blue-900'}`}/>
                              </button>
                              <Popover placement="bottom-end" className=''>
                                  <PopoverHandler>
                                      <FontAwesomeIcon icon={faEllipsis}/>
                                  </PopoverHandler>
                                  <PopoverContent>
                                      <div className=' flex flex-col z-20 items-start space-y-3'>
                                          { userData.email === object.user.email ? 
                                            <>
                                              <button>Edit Story</button>
                                              <button onClick={()=>handleDeletePost(object.id)}>Delete Story</button>
                                            </>
                                            :
                                            <>
                                              <button>Mute this author</button>
                                              <button>Mute this story</button>
                                              <button>Report</button>
                                            </>
                                            }
                                      </div>
                                  </PopoverContent>
                              </Popover>
                          </div>
                          
                      </CardFooter>
                    </div>
                    {/* </Card> */}
                </div>
            ))}
        </div>
        : <p>Error fetching posts</p>
        }
        <div className='md:mt-8'>
          <Pagination totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage}/>
        </div>
            
    </div>
  )
}
export default Posts;
