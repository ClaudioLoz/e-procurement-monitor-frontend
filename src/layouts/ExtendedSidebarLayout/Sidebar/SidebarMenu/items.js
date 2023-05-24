// import AssignmentIndTwoToneIcon from '@mui/icons-material/AssignmentIndTwoTone';
// import AccountTreeTwoToneIcon from '@mui/icons-material/AccountTreeTwoTone';
// import StorefrontTwoToneIcon from '@mui/icons-material/StorefrontTwoTone';
// import ReceiptTwoToneIcon from '@mui/icons-material/ReceiptTwoTone';
import BackupTableTwoToneIcon from '@mui/icons-material/BackupTableTwoTone';
import ThumbsUpDownIcon from '@mui/icons-material/ThumbsUpDown';

const menuItems = [
  {
    heading: 'General',
    items: [
      {
        name: 'Contrataciones a dar seguimiento',
        icon: BackupTableTwoToneIcon,
        link: '/contrataciones-seguimiento/lista',
      },
      {
        name: 'Contrataciones finalizadas',
        icon: ThumbsUpDownIcon,
        link: '/contrataciones-finalizadas/lista',
      }
    ]
  },
  // {
  //   heading: 'Management',
  //   items: [
  //     {
  //       name: 'Users',
  //       icon: AssignmentIndTwoToneIcon,
  //       link: '/extended-sidebar/management/users',
  //       items: [
  //         {
  //           name: 'List',
  //           link: 'management/users/list'
  //         },
  //         {
  //           name: 'User Profile',
  //           link: 'management/users/single'
  //         }
  //       ]
  //     },
  //     {
  //       name: 'Projects',
  //       icon: AccountTreeTwoToneIcon,
  //       link: '/extended-sidebar/management/projects/list'
  //     },
  //     {
  //       name: 'Commerce',
  //       icon: StorefrontTwoToneIcon,
  //       link: '/extended-sidebar/management/commerce',
  //       items: [
  //         {
  //           name: 'Shop',
  //           link: 'management/commerce/shop'
  //         },
  //         {
  //           name: 'List',
  //           link: 'management/commerce/products/list'
  //         },
  //         {
  //           name: 'Details',
  //           link: 'management/commerce/products/single/1'
  //         },
  //         {
  //           name: 'Create',
  //           link: 'management/commerce/products/create'
  //         }
  //       ]
  //     },
  //     {
  //       name: 'Invoices',
  //       icon: ReceiptTwoToneIcon,
  //       link: '/extended-sidebar/management/invoices',
  //       items: [
  //         {
  //           name: 'List',
  //           link: 'management/invoices/list'
  //         },
  //         {
  //           name: 'Details',
  //           link: 'management/invoices/single'
  //         }
  //       ]
  //     }
  //   ]
  // }
];

export default menuItems;
