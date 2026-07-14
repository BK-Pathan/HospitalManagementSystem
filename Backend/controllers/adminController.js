const Doctor = require('../models/doctor');
const Patient = require('../models/patient');
const Appointment = require('../models/appointment');


// Create Doctor
exports.createDoctor = async(req,res)=>{

    try{

        const doctor = await Doctor.create(req.body);

        res.status(201).json({
            message:"Doctor created",
            doctor
        });

    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};


// Update Doctor
exports.updateDoctor = async(req,res)=>{

    try{

        const doctor = await Doctor.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        );


        res.json({
            message:"Doctor updated",
            doctor
        });


    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};



// Delete Doctor
exports.deleteDoctor = async(req,res)=>{

    try{

        await Doctor.findByIdAndDelete(req.params.id);


        res.json({
            message:"Doctor deleted"
        });


    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};



// View All Doctors
exports.getAllDoctors = async(req,res)=>{

    const doctors = await Doctor.find();

    res.json(doctors);

};



// View All Patients
exports.getAllPatients = async(req,res)=>{

    const patients = await Patient.find();

    res.json(patients);

};



// View All Appointments
exports.getAllAppointments = async(req,res)=>{


    const appointments = await Appointment.find()
    .populate("doctor","name specialties")
    .populate("patient","name");


    res.json(appointments);


};