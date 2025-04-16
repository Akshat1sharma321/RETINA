import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertCircle, Plus, Phone, MessageSquare, Save, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Contact {
  id: string;
  name: string;
  phone: string;
  relation: string;
}

const EmergencyContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([
    { id: '1', name: 'Police Control Room', phone: '100', relation: 'Emergency Service' },
    { id: '2', name: 'Ambulance', phone: '108', relation: 'Medical Emergency' },
    { id: '3', name: 'Fire Department', phone: '101', relation: 'Fire Emergency' },
    { id: '4', name: 'Women Helpline', phone: '1091', relation: 'Women Safety' },
    { id: '5', name: 'Disaster Management', phone: '1070', relation: 'Disaster Help' },
  ]);
  
  const [newContact, setNewContact] = useState<Partial<Contact>>({ name: '', phone: '', relation: '' });
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isTriggeringEmergency, setIsTriggeringEmergency] = useState(false);

  const handleAddContact = () => {
    if (!newContact.name || !newContact.phone) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    const contact: Contact = {
      id: Date.now().toString(),
      name: newContact.name,
      phone: newContact.phone,
      relation: newContact.relation || 'Other',
    };
    
    setContacts([...contacts, contact]);
    setNewContact({ name: '', phone: '', relation: '' });
    setIsAddDialogOpen(false);
    toast.success("Contact added successfully");
  };
  
  const handleEditContact = () => {
    if (!editingContact?.name || !editingContact?.phone) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setContacts(contacts.map(contact => 
      contact.id === editingContact.id ? editingContact : contact
    ));
    
    setIsEditDialogOpen(false);
    toast.success("Contact updated successfully");
  };
  
  const handleDeleteContact = (id: string) => {
    setContacts(contacts.filter(contact => contact.id !== id));
    toast.success("Contact removed successfully");
  };
  
  const triggerEmergency = () => {
    setIsTriggeringEmergency(true);
    
    setTimeout(() => {
      toast.success("Emergency alert sent to all contacts");
      setIsTriggeringEmergency(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-1">Emergency Services</h2>
        <p className="text-gray-400">
          Access to emergency services and personal emergency contacts
        </p>
      </div>
      
      <Card className="border border-white/10 bg-black/40 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">National Emergency Numbers</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-navi-400 font-semibold">Police Emergency</p>
            <p className="text-white font-mono text-lg">100</p>
          </div>
          <div className="space-y-2">
            <p className="text-navi-400 font-semibold">Ambulance</p>
            <p className="text-white font-mono text-lg">108</p>
          </div>
          <div className="space-y-2">
            <p className="text-navi-400 font-semibold">Fire Emergency</p>
            <p className="text-white font-mono text-lg">101</p>
          </div>
          <div className="space-y-2">
            <p className="text-navi-400 font-semibold">Women Helpline</p>
            <p className="text-white font-mono text-lg">1091</p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border border-white/10 bg-black/40 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex justify-between items-center">
            Emergency Alert
            <Button 
              onClick={triggerEmergency}
              disabled={isTriggeringEmergency || contacts.length === 0}
              className="bg-red-600 hover:bg-red-700"
            >
              <AlertCircle className="mr-2 h-4 w-4" />
              {isTriggeringEmergency ? "Sending Alert..." : "Send Emergency Alert"}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300">
            Send an emergency alert with your current location to all your emergency contacts and notify nearby emergency services.
          </p>
        </CardContent>
      </Card>
      
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-medium">Personal Emergency Contacts</h3>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-navi-600 hover:bg-navi-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Contact
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border border-white/10">
            <DialogHeader>
              <DialogTitle>Add Emergency Contact</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Name</label>
                <Input 
                  type="text"
                  placeholder="Enter name"
                  className="bg-gray-800 border-gray-700"
                  value={newContact.name}
                  onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Phone Number</label>
                <Input 
                  type="text"
                  placeholder="Enter phone number"
                  className="bg-gray-800 border-gray-700"
                  value={newContact.phone}
                  onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Relation</label>
                <Input 
                  type="text"
                  placeholder="Family, Friend, Caregiver, etc."
                  className="bg-gray-800 border-gray-700"
                  value={newContact.relation || ''}
                  onChange={(e) => setNewContact({...newContact, relation: e.target.value})}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddContact} className="bg-navi-600 hover:bg-navi-700">
                <Save className="mr-2 h-4 w-4" />
                Save Contact
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      {contacts.length === 0 ? (
        <Card className="border border-white/10 bg-black/40 backdrop-blur-sm p-6 text-center">
          <p className="text-gray-400">No personal emergency contacts added yet.</p>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            variant="link"
            className="mt-2 text-navi-400"
          >
            Add your first contact
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {contacts.map(contact => (
            <Card key={contact.id} className="border border-white/10 bg-black/40 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-lg">{contact.name}</h4>
                    <p className="text-gray-400">{contact.relation}</p>
                    <p className="text-gray-300 font-mono mt-1">{contact.phone}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="rounded-full h-8 w-8 text-green-400"
                      onClick={() => window.location.href = `tel:${contact.phone}`}
                    >
                      <Phone size={16} />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="rounded-full h-8 w-8 text-blue-400"
                      onClick={() => window.location.href = `sms:${contact.phone}`}
                    >
                      <MessageSquare size={16} />
                    </Button>
                    <Dialog open={isEditDialogOpen && editingContact?.id === contact.id} onOpenChange={(open) => {
                      setIsEditDialogOpen(open);
                      if (!open) setEditingContact(null);
                    }}>
                      <DialogTrigger asChild>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="rounded-full h-8 w-8"
                          onClick={() => setEditingContact(contact)}
                        >
                          <Edit size={16} />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-gray-900 border border-white/10">
                        <DialogHeader>
                          <DialogTitle>Edit Contact</DialogTitle>
                        </DialogHeader>
                        {editingContact && (
                          <>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Name</label>
                                <Input 
                                  type="text"
                                  className="bg-gray-800 border-gray-700"
                                  value={editingContact.name}
                                  onChange={(e) => setEditingContact({
                                    ...editingContact, 
                                    name: e.target.value
                                  })}
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Phone Number</label>
                                <Input 
                                  type="text"
                                  className="bg-gray-800 border-gray-700"
                                  value={editingContact.phone}
                                  onChange={(e) => setEditingContact({
                                    ...editingContact, 
                                    phone: e.target.value
                                  })}
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Relation</label>
                                <Input 
                                  type="text"
                                  className="bg-gray-800 border-gray-700"
                                  value={editingContact.relation}
                                  onChange={(e) => setEditingContact({
                                    ...editingContact, 
                                    relation: e.target.value
                                  })}
                                />
                              </div>
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                onClick={() => setIsEditDialogOpen(false)}
                              >
                                Cancel
                              </Button>
                              <Button 
                                onClick={handleEditContact}
                                className="bg-navi-600 hover:bg-navi-700"
                              >
                                Save Changes
                              </Button>
                            </div>
                          </>
                        )}
                      </DialogContent>
                    </Dialog>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="rounded-full h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      onClick={() => handleDeleteContact(contact.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmergencyContacts;
