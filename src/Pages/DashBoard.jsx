import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { ExternalLink } from 'lucide-react';
import Button from '@mui/joy/Button';
import Stack from '@mui/joy/Stack';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';


const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    const fetchProjectsData = async () => {
      const { data, error } = await supabase.from('projects').select('*');
      if (error) {
        console.error("error fecthing project data", error)
      }
      else {
        setProjects(data)
      }
    };
    fetchProjectsData();
  }, [])
  const [layout, setLayout] = React.useState(undefined);
  const [selectedProject, setSelectedProject] = useState([]);


  return (
    <>
      <div className="container-custom py-8 mt-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">


          {projects.map((projects, index) => (

            < div className="bg-gray-200 rounded-xl shadow-lg p-6" key={index} variant="outlined"
              color="neutral"
              onClick={() => {
                setSelectedProject(projects)
                setLayout('fullscreen');
              }}>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">{projects.name}</h2>

              <a href={projects.website_url} target='_blank' rel='no oppener' className='flex gap-1 text-blue-700 w-10'>
                <ExternalLink />Link
              </a>

              <p className="text-sm  text-blue-900">{projects.tagline}</p>
              <div className='flex'>
                category Type:
                <p className="text-lg  text-blue-900">{selectedProject.category_type}</p>
              </div>
            </div>
          ))
          }
        </div >
      </div >
      <div>

        <Modal open={!!layout} onClose={() => setLayout(undefined)}>
          <ModalDialog layout={layout}>
            <ModalClose />
            {selectedProject && (
              <>
                <DialogTitle className="text-2xl font-bold text-gray-800 mb-4">{selectedProject.name}</DialogTitle>
                <a href={projects.website_url} target='_blank' rel='no oppener' className='flex gap-1 text-blue-700'>
                  <ExternalLink />Link
                </a>
                <p className="text-sm  text-blue-900">{projects.tagline}</p>
                <div className='flex'>
                  category Type:
                  <p className="text-lg  text-blue-900">{selectedProject.category_type}</p>
                </div>
                <DialogContent>
                  <p>{selectedProject.description}</p>
                  <p>
                    {new Date(selectedProject.created_at).toLocaleDateString("en-GB", {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                  <p>{selectedProject.team_emails}</p>
                  <p>{selectedProject.links}</p>
                </DialogContent>
              </>
            )}
          </ModalDialog>
        </Modal>
      </div >
    </>

  );
};

export default Dashboard