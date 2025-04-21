import React, { useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Plus } from 'lucide-react';

type FamilyMemberType = {
  fullName: string;
  relation: string;
};

type VolunteerFormData = {
  familyMembers: FamilyMemberType[];
};

export function VolunteerForm() {
  const { control, register, handleSubmit, formState: { errors } } = useForm<VolunteerFormData>({
    defaultValues: {
      familyMembers: [{ fullName: '', relation: '' }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "familyMembers"
  });

  const onSubmit = (data: VolunteerFormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      
      <Card className="p-6 bg-white/80 backdrop-blur-sm">
        <h3 className="text-xl font-semibold mb-4">Family Members</h3>
        {fields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <Input
                {...register(`familyMembers.${index}.fullName`, { 
                  required: "Full name is required" 
                })}
                placeholder="Enter full name"
              />
              {errors.familyMembers?.[index]?.fullName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.familyMembers[index]?.fullName?.message}
                </p>
              )}
            </div>
            
            <div className="flex items-end space-x-2">
              <div className="flex-grow">
                <label className="block text-sm font-medium text-gray-700">
                  Relation
                </label>
                <Input
                  {...register(`familyMembers.${index}.relation`, { 
                    required: "Relation is required" 
                  })}
                  placeholder="Enter relation"
                />
                {errors.familyMembers?.[index]?.relation && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.familyMembers[index]?.relation?.message}
                  </p>
                )}
              </div>
              
              {index > 0 && (
                <Button 
                  type="button" 
                  variant="destructive" 
                  size="icon" 
                  onClick={() => remove(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
        
        <Button 
          type="button" 
          variant="outline" 
          className="mt-2"
          onClick={() => append({ fullName: '', relation: '' })}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Family Member
        </Button>
      </Card>
      
    </form>
  );
}
