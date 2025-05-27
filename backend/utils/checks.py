from rest_framework.response import Response
from rest_framework import status
from functools import wraps

def group_and_super_user_checks(group_names = []):
    """
    Decorator to restrict access to users in specific groups or super user.

    Args:
        group_names (str or list): The group name(s) to check. Can be a string or a list of strings.

    Returns:
        function: The wrapped view function with group access control.
    """
    
    if isinstance(group_names, str):
        group_names = [group_names] 

    def inner(view_func):
        
        @wraps(view_func)
        def _wrapper(request, *args, **kwargs):
            
            if not request.user.is_superuser and request.user.role_fk.role_name not in group_names:
                return Response(
                    {"detail": "You do not have permission to access this resource."},
                    status=status.HTTP_403_FORBIDDEN
                )

            return view_func(request, *args, **kwargs)
        
        return _wrapper
    
    return inner

def checks_and_get_required_fields(data, required_fields):
    missing_fields = [field for field in required_fields if not data.get(field)]
    #print(missing_fields)
    if missing_fields:
        return Response({"error": f"Missing fields: {', '.join(missing_fields)}"}, status=status.HTTP_400_BAD_REQUEST)
    return {field: data.get(field) for field in required_fields}

def get_present_fields(data, present_field):
    present_fields = {field: data.get(field) for field in present_field if data.get(field) not in [None, '', [], {}]}
    return present_fields